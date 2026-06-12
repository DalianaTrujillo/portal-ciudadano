package extractors

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"golang.org/x/net/html"
)

type ExtractionResult struct {
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	Keywords    []string   `json:"keywords"`
	Links       []string   `json:"links"`
	Entity      string     `json:"entity"`
	Category    string     `json:"category"`
	PublishedAt *time.Time `json:"published_at"`
}

type Extractor struct {
	knownEntities   []string
	entityShortMap  map[string]string
	knownCategories []string
	stopWords       map[string]bool
	datePatterns    []datePattern
}

type datePattern struct {
	re     *regexp.Regexp
	layout string
}

func NewExtractor() *Extractor {
	return &Extractor{
		knownEntities: []string{
			"Ministerio de Minas y Energía", "MinMinas", "Minenergía",
			"Agencia Nacional de Minería", "ANM",
			"Servicio Geológico Colombiano", "SGC",
			"Comisión de Regulación de Energía y Gas", "CREG",
			"Unidad de Planeación Minero Energética", "UPME",
			"Ministerio de Ambiente", "MinAmbiente",
			"Gobierno de Colombia", "Presidencia de la República",
			"Congreso de la República", "Departamento Nacional de Planeación", "DNP",
			"Agencia Nacional de Hidrocarburos", "ANH",
		},
		entityShortMap: map[string]string{
			"ANM":      "Agencia Nacional de Minería (ANM)",
			"SGC":      "Servicio Geológico Colombiano (SGC)",
			"CREG":     "Comisión de Regulación de Energía y Gas (CREG)",
			"UPME":     "Unidad de Planeación Minero Energética (UPME)",
			"DNP":      "Departamento Nacional de Planeación (DNP)",
			"ANH":      "Agencia Nacional de Hidrocarburos (ANH)",
			"MinMinas": "Ministerio de Minas y Energía",
		},
		knownCategories: []string{
			"Regalías Mineras", "Datos e Indicadores", "Visor Territorial",
			"Aprende sobre el Sector", "Participa", "Noticias y Novedades",
			"Trámites", "PQRSD", "Agencia Nacional de Minería (ANM)",
			"Servicio Geológico Colombiano (SGC)", "Fiscalización",
			"Geología", "Hidrocarburos", "Energía", "Normatividad",
		},
		stopWords: map[string]bool{
			"el": true, "la": true, "los": true, "las": true,
			"de": true, "del": true, "a": true, "al": true, "en": true,
			"y": true, "e": true, "o": true, "u": true, "no": true, "si": true,
			"un": true, "una": true, "que": true, "es": true, "son": true,
			"con": true, "por": true, "para": true, "como": true,
			"este": true, "esta": true, "su": true, "se": true, "ha": true,
			"lo": true, "le": true, "entre": true, "sin": true, "sobre": true,
		},
		datePatterns: []datePattern{
			{regexp.MustCompile(`\b(\d{2})/(\d{2})/(\d{4})\b`), "02/01/2006"},
			{regexp.MustCompile(`\b(\d{4})-(\d{2})-(\d{2})\b`), "2006-01-02"},
			{regexp.MustCompile(`\b(\d{2})-(\d{2})-(\d{4})\b`), "02-01-2006"},
		},
	}
}

func (e *Extractor) ExtractFromFile(filePath string) (*ExtractionResult, error) {
	ext := strings.ToLower(filepath.Ext(filePath))

	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("cannot read file: %w", err)
	}

	return e.ExtractFromBytes(data, ext, filepath.Base(filePath))
}

func (e *Extractor) ExtractFromBytes(data []byte, ext, name string) (*ExtractionResult, error) {
	switch ext {
	case ".html", ".htm":
		return e.extractHTML(data, name)
	case ".pdf":
		return e.extractPDF(data, name)
	case ".docx":
		return e.extractDOCX(data, name)
	case ".xlsx":
		return e.extractXLSX(data, name)
	case ".csv":
		return e.extractCSV(data, name)
	case ".json":
		return e.extractJSON(data, name)
	case ".txt":
		return e.extractTXT(data, name)
	default:
		return nil, fmt.Errorf("unsupported file type: %s", ext)
	}
}

func (e *Extractor) extractHTML(data []byte, name string) (*ExtractionResult, error) {
	doc, err := html.Parse(strings.NewReader(string(data)))
	if err != nil {
		return nil, fmt.Errorf("cannot parse HTML: %w", err)
	}

	result := &ExtractionResult{
		Title: e.extractHTMLTitle(doc),
	}

	var textParts []string
	e.extractHTMLText(doc, &textParts)
	result.Content = strings.TrimSpace(strings.Join(textParts, " "))

	result.Links = e.extractHTMLLinks(doc)
	result.PublishedAt = e.extractDate(result.Content)
	result.Entity = e.extractEntity(result.Content)
	result.Category = e.extractCategory(result.Content)
	result.Keywords = e.extractKeywords(result.Content, 10)

	if result.Title == "" {
		result.Title = extractTitleFromContent(result.Content, name)
	}

	return result, nil
}

func (e *Extractor) extractHTMLTitle(n *html.Node) string {
	if n.Type == html.ElementNode && n.Data == "title" && n.FirstChild != nil {
		return strings.TrimSpace(n.FirstChild.Data)
	}
	meta := findMetaProperty(n, "og:title")
	if meta != "" {
		return meta
	}
	h1 := findElementText(n, "h1")
	if h1 != "" {
		return h1
	}
	return ""
}

func findMetaProperty(n *html.Node, property string) string {
	if n.Type == html.ElementNode && n.Data == "meta" {
		var prop, content string
		for _, attr := range n.Attr {
			if attr.Key == "property" {
				prop = attr.Val
			}
			if attr.Key == "content" {
				content = attr.Val
			}
		}
		if prop == property && content != "" {
			return content
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if val := findMetaProperty(c, property); val != "" {
			return val
		}
	}
	return ""
}

func findElementText(n *html.Node, tag string) string {
	if n.Type == html.ElementNode && n.Data == tag {
		var text strings.Builder
		collectText(n, &text)
		if t := strings.TrimSpace(text.String()); t != "" {
			return t
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if val := findElementText(c, tag); val != "" {
			return val
		}
	}
	return ""
}

func collectText(n *html.Node, buf *strings.Builder) {
	if n.Type == html.TextNode {
		buf.WriteString(n.Data)
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		collectText(c, buf)
	}
}

func (e *Extractor) extractHTMLText(n *html.Node, parts *[]string) {
	switch n.Type {
	case html.ElementNode:
		switch n.Data {
		case "script", "style", "noscript":
			return
		}
	}

	if n.Type == html.TextNode {
		t := strings.TrimSpace(n.Data)
		if t != "" {
			*parts = append(*parts, t)
		}
	}

	for c := n.FirstChild; c != nil; c = c.NextSibling {
		e.extractHTMLText(c, parts)
	}
}

func (e *Extractor) extractHTMLLinks(n *html.Node) []string {
	var links []string
	var extract func(*html.Node)
	extract = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			for _, attr := range n.Attr {
				if attr.Key == "href" {
					href := strings.TrimSpace(attr.Val)
					if href != "" && !strings.HasPrefix(href, "#") &&
						!strings.HasPrefix(href, "javascript:") &&
						!strings.HasPrefix(href, "mailto:") {
						links = append(links, href)
					}
					break
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			extract(c)
		}
	}
	extract(n)
	return links
}

func (e *Extractor) extractPDF(data []byte, name string) (*ExtractionResult, error) {
	content := extractTextFromPDFRaw(data)
	content = strings.TrimSpace(content)
	if content == "" {
		return nil, fmt.Errorf("no text extracted from PDF")
	}

	return &ExtractionResult{
		Content:     content,
		Title:       extractTitleFromContent(content, name),
		Keywords:    e.extractKeywords(content, 10),
		Entity:      e.extractEntity(content),
		Category:    e.extractCategory(content),
		PublishedAt: e.extractDate(content),
	}, nil
}

func (e *Extractor) extractDOCX(data []byte, name string) (*ExtractionResult, error) {
	content := strings.TrimSpace(parseDOCXText(string(data)))
	if content == "" {
		return nil, fmt.Errorf("no text extracted from DOCX")
	}

	return &ExtractionResult{
		Content:     content,
		Title:       extractTitleFromContent(content, name),
		Keywords:    e.extractKeywords(content, 10),
		Entity:      e.extractEntity(content),
		Category:    e.extractCategory(content),
		PublishedAt: e.extractDate(content),
	}, nil
}

func (e *Extractor) extractXLSX(data []byte, name string) (*ExtractionResult, error) {
	content := strings.TrimSpace(parseXLSXText(string(data)))
	if content == "" {
		return nil, fmt.Errorf("no text extracted from XLSX")
	}

	return &ExtractionResult{
		Content:     content,
		Title:       extractTitleFromContent(content, name),
		Keywords:    e.extractKeywords(content, 10),
		Entity:      e.extractEntity(content),
		Category:    e.extractCategory(content),
		PublishedAt: e.extractDate(content),
	}, nil
}

func (e *Extractor) extractCSV(data []byte, name string) (*ExtractionResult, error) {
	reader := csv.NewReader(strings.NewReader(string(data)))
	reader.LazyQuotes = true
	reader.FieldsPerRecord = -1

	var content strings.Builder
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			continue
		}
		content.WriteString(strings.Join(record, " "))
		content.WriteString("\n")
	}

	result := strings.TrimSpace(content.String())
	if result == "" {
		return nil, fmt.Errorf("no text extracted from CSV")
	}

	return &ExtractionResult{
		Content:  result,
		Title:    extractTitleFromContent(result, name),
		Keywords: e.extractKeywords(result, 10),
		Entity:   e.extractEntity(result),
		Category: e.extractCategory(result),
	}, nil
}

func (e *Extractor) extractJSON(data []byte, name string) (*ExtractionResult, error) {
	var raw interface{}
	if err := json.Unmarshal(data, &raw); err != nil {
		return nil, fmt.Errorf("cannot parse JSON: %w", err)
	}

	content := strings.TrimSpace(flattenJSON(raw))
	if content == "" {
		return nil, fmt.Errorf("no text extracted from JSON")
	}

	return &ExtractionResult{
		Content:  content,
		Title:    extractTitleFromContent(content, name),
		Keywords: e.extractKeywords(content, 10),
		Entity:   e.extractEntity(content),
		Category: e.extractCategory(content),
	}, nil
}

func (e *Extractor) extractTXT(data []byte, name string) (*ExtractionResult, error) {
	content := strings.TrimSpace(string(data))
	if content == "" {
		return nil, fmt.Errorf("empty text file")
	}

	return &ExtractionResult{
		Content:     content,
		Title:       extractTitleFromContent(content, name),
		Keywords:    e.extractKeywords(content, 10),
		Entity:      e.extractEntity(content),
		Category:    e.extractCategory(content),
		PublishedAt: e.extractDate(content),
	}, nil
}

func extractTitleFromContent(content, fileName string) string {
	lines := strings.Split(strings.TrimSpace(content), "\n")
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if len(trimmed) > 10 && len(trimmed) < 200 {
			return trimmed
		}
	}
	name := strings.TrimSuffix(fileName, filepath.Ext(fileName))
	return name
}

func (e *Extractor) extractEntity(text string) string {
	lower := strings.ToLower(text)
	for _, entity := range e.knownEntities {
		if strings.Contains(lower, strings.ToLower(entity)) {
			return entity
		}
	}
	for short, full := range e.entityShortMap {
		if strings.Contains(lower, strings.ToLower(short)) {
			return full
		}
	}
	return ""
}

func (e *Extractor) extractCategory(text string) string {
	lower := strings.ToLower(text)
	scores := make(map[string]int)

	for _, cat := range e.knownCategories {
		catLower := strings.ToLower(cat)
		if strings.Contains(lower, catLower) {
			scores[cat] += 3
		}
		for _, w := range strings.Fields(catLower) {
			if len(w) > 4 && strings.Contains(lower, w) {
				scores[cat]++
			}
		}
	}

	bestCat := ""
	bestScore := 0
	for cat, score := range scores {
		if score > bestScore {
			bestScore = score
			bestCat = cat
		}
	}
	return bestCat
}

func (e *Extractor) extractKeywords(text string, max int) []string {
	lower := strings.ToLower(text)
	words := strings.FieldsFunc(lower, func(r rune) bool {
		return !(r >= 'a' && r <= 'z') && !(r >= '0' && r <= '9') && r != 'ñ' && r != 'á' && r != 'é' && r != 'í' && r != 'ó' && r != 'ú' && r != 'ü'
	})

	freq := make(map[string]int)
	for _, w := range words {
		w = strings.Trim(w, "'\".,;:!?¡¿()[]{}<>")
		if len(w) <= 3 || e.stopWords[w] {
			continue
		}
		freq[w]++
	}

	type wf struct {
		w string
		f int
	}
	var sorted []wf
	for w, f := range freq {
		sorted = append(sorted, wf{w, f})
	}
	for i := 0; i < len(sorted); i++ {
		for j := i + 1; j < len(sorted); j++ {
			if sorted[j].f > sorted[i].f {
				sorted[i], sorted[j] = sorted[j], sorted[i]
			}
		}
	}

	var keywords []string
	for _, item := range sorted {
		if len(keywords) >= max {
			break
		}
		keywords = append(keywords, item.w)
	}
	return keywords
}

func (e *Extractor) extractDate(text string) *time.Time {
	lower := strings.ToLower(text)

	for _, dp := range e.datePatterns {
		match := dp.re.FindString(lower)
		if match != "" {
			if t, err := time.Parse(dp.layout, match); err == nil {
				return &t
			}
		}
	}

	months := map[string]string{
		"enero": "January", "febrero": "February", "marzo": "March",
		"abril": "April", "mayo": "May", "junio": "June",
		"julio": "July", "agosto": "August", "septiembre": "September",
		"octubre": "October", "noviembre": "November", "diciembre": "December",
	}

	dateStr := lower
	for es, en := range months {
		dateStr = strings.ReplaceAll(dateStr, es, en)
	}

	textFormats := []string{
		"2 de January de 2006", "2 de January del 2006",
		"2 de January 2006", "January 2, 2006", "January 2 2006",
	}

	words := strings.Fields(dateStr)
	for i := 0; i <= len(words)-3; i++ {
		candidate := strings.Join(words[i:min(i+5, len(words))], " ")
		for _, f := range textFormats {
			if t, err := time.Parse(f, candidate); err == nil {
				return &t
			}
		}
	}

	return nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func flattenJSON(v interface{}) string {
	switch val := v.(type) {
	case string:
		return val
	case map[string]interface{}:
		var parts []string
		for _, v := range val {
			parts = append(parts, flattenJSON(v))
		}
		return strings.Join(parts, " ")
	case []interface{}:
		var parts []string
		for _, v := range val {
			parts = append(parts, flattenJSON(v))
		}
		return strings.Join(parts, " ")
	case float64:
		return fmt.Sprintf("%.0f", val)
	case bool:
		if val {
			return "true"
		}
		return "false"
	default:
		return fmt.Sprintf("%v", val)
	}
}

func extractTextFromPDFRaw(data []byte) string {
	var text strings.Builder
	scanner := bufio.NewScanner(strings.NewReader(string(data)))
	inText := false

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		if strings.HasPrefix(line, "BT") {
			inText = true
			continue
		}
		if strings.HasPrefix(line, "ET") {
			inText = false
			continue
		}
		if !inText {
			continue
		}

		if strings.HasSuffix(line, ")Tj") || strings.HasSuffix(line, ")'") {
			start := strings.Index(line, "(")
			end := strings.LastIndex(line, ")")
			if start >= 0 && end > start {
				content := line[start+1 : end]
				if content != "" && content != " " {
					text.WriteString(content)
					text.WriteString(" ")
				}
			}
		}
		if strings.HasSuffix(line, ")TJ") {
			start := strings.Index(line, "(")
			end := strings.LastIndex(line, ")")
			if start >= 0 && end > start {
				content := line[start+1 : end]
				if content != "" && content != " " {
					text.WriteString(content)
					text.WriteString(" ")
				}
			}
		}
	}

	return strings.Join(strings.Fields(text.String()), " ")
}

func parseDOCXText(data string) string {
	var text strings.Builder
	startTag := "<w:t"
	endTag := "</w:t>"

	for _, line := range strings.Split(data, "\n") {
		for {
			start := strings.Index(line, startTag)
			if start < 0 {
				break
			}
			gtIdx := strings.Index(line[start:], ">")
			if gtIdx < 0 {
				break
			}
			contentStart := start + gtIdx + 1
			end := strings.Index(line[contentStart:], endTag)
			if end < 0 {
				break
			}
			content := line[contentStart : contentStart+end]
			if strings.TrimSpace(content) != "" {
				text.WriteString(content)
				text.WriteString(" ")
			}
			line = line[contentStart+end+len(endTag):]
		}
	}
	return strings.TrimSpace(text.String())
}

func parseXLSXText(data string) string {
	var text strings.Builder
	startTag := "<v"
	endTag := "</v>"
	inSheet := false

	for _, line := range strings.Split(data, "\n") {
		if strings.Contains(line, "<sheetData") {
			inSheet = true
			continue
		}
		if strings.Contains(line, "</sheetData>") {
			break
		}
		if !inSheet {
			continue
		}

		for {
			start := strings.Index(line, startTag)
			if start < 0 {
				break
			}
			gtIdx := strings.Index(line[start:], ">")
			if gtIdx < 0 {
				break
			}
			contentStart := start + gtIdx + 1
			end := strings.Index(line[contentStart:], endTag)
			if end < 0 {
				break
			}
			content := line[contentStart : contentStart+end]
			if strings.TrimSpace(content) != "" {
				text.WriteString(content)
				text.WriteString(" ")
			}
			line = line[contentStart+end+len(endTag):]
		}
	}
	return strings.TrimSpace(text.String())
}
