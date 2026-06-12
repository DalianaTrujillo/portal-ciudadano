package crawler

import (
	"net/url"
	"strings"
)

type Discoverer struct {
	baseURL       *url.URL
	sameDomainOnly bool
	visited       map[string]bool
	maxPages      int
}

func NewDiscoverer(startURL string, sameDomainOnly bool, maxPages int) *Discoverer {
	parsed, err := url.Parse(startURL)
	baseURL := parsed
	if err != nil {
		baseURL = &url.URL{Scheme: "http", Host: "localhost"}
	}

	return &Discoverer{
		baseURL:        baseURL,
		sameDomainOnly: sameDomainOnly,
		visited:        make(map[string]bool),
		maxPages:       maxPages,
	}
}

func (d *Discoverer) FilterLinks(links []string, currentURL string) []string {
	var filtered []string
	parsedCurrent, _ := url.Parse(currentURL)

	for _, link := range links {
		absolute := d.resolveURL(link, parsedCurrent)
		if absolute == "" {
			continue
		}

		if d.visited[absolute] {
			continue
		}

		if d.sameDomainOnly && !d.isSameDomain(absolute) {
			continue
		}

		if d.isExternalResource(absolute) {
			continue
		}

		if d.isAnchor(absolute, currentURL) {
			continue
		}

		if len(d.visited) >= d.maxPages {
			break
		}

		filtered = append(filtered, absolute)
		d.visited[absolute] = true
	}

	return filtered
}

func (d *Discoverer) resolveURL(link string, base *url.URL) string {
	link = strings.TrimSpace(link)
	if link == "" {
		return ""
	}

	parsed, err := url.Parse(link)
	if err != nil {
		return ""
	}

	if parsed.IsAbs() {
		if parsed.Scheme != "http" && parsed.Scheme != "https" {
			return ""
		}
		return parsed.String()
	}

	resolved := base.ResolveReference(parsed)
	resolved.Fragment = ""
	return resolved.String()
}

func (d *Discoverer) isSameDomain(rawURL string) bool {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return false
	}
	return parsed.Host == d.baseURL.Host
}

func (d *Discoverer) isExternalResource(rawURL string) bool {
	ext := strings.ToLower(getExt(rawURL))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico", ".webp",
		".mp4", ".mp3", ".avi", ".mov",
		".css", ".js", ".woff", ".woff2", ".ttf", ".eot":
		return true
	}
	return false
}

func (d *Discoverer) isAnchor(rawURL, currentURL string) bool {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return false
	}
	return parsed.Fragment != "" && strings.HasPrefix(rawURL, currentURL)
}

func (d *Discoverer) NormalizeURL(rawURL string) string {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return rawURL
	}
	parsed.Fragment = ""
	parsed.RawQuery = ""
	return parsed.String()
}

func (d *Discoverer) IsVisited(rawURL string) bool {
	return d.visited[rawURL]
}

func (d *Discoverer) VisitedCount() int {
	return len(d.visited)
}
