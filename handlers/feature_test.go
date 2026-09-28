package handlers

import (
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// TestTableDrivenVerifyOrigin tests the verifyOrigin middleware using table-driven tests.
func TestTableDrivenVerifyOrigin(t *testing.T) {
	tests := []struct {
		name     string
		header   string
		expected int
	}{
		{"Valid Origin", "https://valid.example.com", http.StatusOK},
		{"Invalid Origin", "http://invalid.example.com", http.StatusForbidden},
		{"No Origin Header", "", http.StatusForbidden},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := gin.Default()
			w := httptest.NewRecorder()

			// Create a route that uses the verifyOrigin middleware
			r.POST("/test", verifyOrigin, func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "success"})
			})

			req, err := http.NewRequest("POST", "/test", nil)
			if err != nil {
				t.Fatal(err)
			}

			// Set the Origin header for this request
			if tt.header != "" {
				req.Header.Set("Origin", tt.header)
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tt.expected, w.Code)
		})
	}
}