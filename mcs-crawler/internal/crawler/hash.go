package crawler

import (
	"crypto/sha256"
	"fmt"
	"strings"
)

func ComputeHash(content string) string {
	normalized := strings.Join(strings.Fields(content), " ")
	h := sha256.Sum256([]byte(normalized))
	return fmt.Sprintf("%x", h)
}

func HasChanged(existingHash, newHash string) bool {
	return existingHash != newHash
}
