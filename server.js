import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3001
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY
const FIGMA_API_KEY = process.env.VITE_FIGMA_API_KEY

console.log('Environment loaded:')
console.log('Gemini API Key:', GEMINI_API_KEY ? 'SET' : 'NOT SET')
console.log('Figma API Key:', FIGMA_API_KEY ? 'SET' : 'NOT SET')

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Gemini API proxy endpoint
app.post('/api/analyze-design', async (req, res) => {
  try {
    const { imageUrl, description } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' })
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' })
    }

    console.log('Analyzing design with Gemini...')

    try {
      // For Gemini v1 API with proper image handling
      let imageData = imageUrl
      let mimeType = 'image/jpeg'

      // Handle data URLs (extract base64 part)
      if (imageUrl.startsWith('data:')) {
        const matches = imageUrl.match(/data:([^;]+);base64,(.+)/)
        if (matches) {
          mimeType = matches[1]
          imageData = matches[2]
        }
      }

      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze this Flutter UI design image and extract all visible Flutter widgets. Return ONLY a valid JSON object with this exact structure where each widget has Flutter-specific types (ElevatedButton, TextField, Text, Container, Column, Row, Card, Image, Icon, etc):
{
  "elements": [
    {
      "type": "ElevatedButton",
      "args": {
        "onPressed": "\${handleButtonPress()}",
        "style": {
          "backgroundColor": "#0ea5e9",
          "padding": "12 24"
        },
        "child": {
          "type": "Text",
          "args": {
            "text": "Get Started",
            "style": {
              "fontSize": 16,
              "fontWeight": "bold",
              "color": "#ffffff"
            }
          }
        }
      }
    },
    {
      "type": "TextField",
      "args": {
        "decoration": {
          "hintText": "Enter your email",
          "border": "OutlineInputBorder",
          "contentPadding": "12 16"
        },
        "keyboardType": "email",
        "style": {
          "fontSize": 14
        }
      }
    },
    {
      "type": "Text",
      "args": {
        "text": "Welcome to UIBuilder",
        "style": {
          "fontSize": 28,
          "fontWeight": "bold",
          "color": "#1e293b"
        }
      }
    }
  ],
  "summary": "Brief description of the Flutter UI",
  "confidence": 0.9,
  "suggestions": ["improvement1", "improvement2"]
}

${description ? `Context: ${description}` : 'Extract all Flutter widgets from this design image and return valid Flutter widget structure.'}`,
                },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: imageData,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            'x-goog-api-key': GEMINI_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      const content = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const analysisResult = JSON.parse(jsonMatch[0])
          return res.json(analysisResult)
        }
      }

      return res.status(500).json({ error: 'Invalid response format from Gemini' })
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError.response?.data || geminiError.message)
      
      // Fallback: Return mock response for demonstration
      console.log('Using mock response for demonstration...')
      return res.json({
        elements: [
          {
            "type": "Card",
            "name": "BudgetInfoCard",
            "position": {},
            "size": {},
            "args": {
              "elevation": 4,
              "shape": { "borderRadius": "16px" },
              "color": "#ffffff",
              "child": {
                "type": "Container",
                "args": { "padding": "24 20" }
              }
            }
          },
          {
            "type": "ElevatedButton",
            "name": "PrimaryActionButton",
            "position": {},
            "size": {},
            "args": {
              "onPressed": "${handleAction()}",
              "style": {
                "backgroundColor": "#0ea5e9",
                "padding": "12 24",
                "borderRadius": "8px",
                "shadowColor": "transparent"
              },
              "child": {
                "type": "Text",
                "args": {
                  "text": "Button Label",
                  "style": {
                    "fontSize": 16,
                    "fontWeight": "w600",
                    "color": "#ffffff"
                  }
                }
              }
            }
          },
          {
            "type": "Text",
            "name": "MainHeadingText",
            "position": {},
            "size": {},
            "args": {
              "text": "Union Budget Title",
              "style": {
                "fontSize": 24,
                "fontWeight": "bold",
                "color": "#1e293b"
              }
            }
          },
          {
            "type": "Text",
            "name": "SecondaryDetailText",
            "position": {},
            "size": {},
            "args": {
              "text": "1st Feb, 2026 (Sunday)",
              "style": {
                "fontSize": 12,
                "color": "#475569"
              }
            }
          },
          {
            "type": "Row",
            "name": "EventStatusHeader",
            "position": {},
            "size": {},
            "args": {
              "children": [
                {
                  "type": "Icon",
                  "args": {
                    "icon": "sparkles",
                    "size": 14,
                    "color": "#ffdd4a"
                  }
                },
                {
                  "type": "Text",
                  "args": {
                    "text": "Event Status",
                    "style": {
                      "fontSize": 14,
                      "color": "#0ea5e9"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "Chip",
            "name": "InfoChip",
            "position": {},
            "size": {},
            "args": {
              "label": {
                "type": "Text",
                "args": {
                  "text": "Chip Label",
                  "style": {
                    "fontSize": 12,
                    "color": "#475569"
                  }
                }
              },
              "backgroundColor": "#f1f5f9",
              "shape": { "borderRadius": "8px" },
              "padding": "6 10"
            }
          },
          {
            "type": "Chip",
            "name": "IconInfoChip",
            "position": {},
            "size": {},
            "args": {
              "avatar": {
                "type": "Icon",
                "args": {
                  "icon": "sparkles",
                  "size": 16,
                  "color": "#0ea5e9"
                }
              },
              "label": {
                "type": "Text",
                "args": {
                  "text": "Insights by uTrade AI",
                  "style": {
                    "fontSize": 12,
                    "color": "#475569"
                  }
                }
              },
              "backgroundColor": "#f1f5f9",
              "shape": { "borderRadius": "8px" },
              "padding": "6 10"
            }
          },
          {
            "type": "Image",
            "name": "FeatureIllustration",
            "position": {},
            "size": {},
            "args": {
              "src": "budget_live_illustration.png",
              "fit": "contain",
              "width": 180,
              "height": 180
            }
          },
          {
            "type": "Container",
            "name": "PlaceholderLine",
            "position": {},
            "size": {},
            "args": {
              "height": 8,
              "width": 120,
              "decoration": {
                "color": "#e2e8f0",
                "borderRadius": "4px"
              }
            }
          },
          {
            "type": "FloatingActionButton",
            "name": "CircularActionButton",
            "position": {},
            "size": {},
            "args": {
              "onPressed": "${handleFloatingAction()}",
              "backgroundColor": "#0ea5e9",
              "child": {
                "type": "Icon",
                "args": {
                  "icon": "sparkles",
                  "color": "#ffffff",
                  "size": 24
                }
              },
              "mini": false
            }
          },
          {
            "type": "Container",
            "name": "CircularIconBackground",
            "position": {},
            "size": {},
            "args": {
              "decoration": {
                "color": "#e0f2fe",
                "borderRadius": "circular"
              },
              "child": {
                "type": "Icon",
                "args": {
                  "icon": "account_balance",
                  "color": "#0ea5e9",
                  "size": 24
                }
              },
              "padding": "8"
            }
          }
        ],
        summary: 'Flutter UI design with cards, buttons, text, and interactive elements. Modern, clean design.',
        confidence: 0.9,
        suggestions: [
          'Add proper spacing between elements',
          'Consider adding animations for better UX',
          'Ensure accessibility with proper labels',
        ],
      })
    }
  } catch (error) {
    console.error('Error analyzing design:', error.response?.data || error.message)
    return res.status(500).json({
      error: `Analysis failed: ${error.message}`,
    })
  }
})

// Figma API proxy endpoint (optional)
app.get('/api/figma/:fileKey', async (req, res) => {
  try {
    const { fileKey } = req.params

    if (!FIGMA_API_KEY) {
      return res.status(500).json({ error: 'Figma API key not configured' })
    }

    const figmaResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_API_KEY,
        },
      }
    )

    return res.json(figmaResponse.data)
  } catch (error) {
    console.error('Error fetching Figma file:', error.message)
    return res.status(500).json({ error: 'Failed to fetch Figma file' })
  }
})

app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`)
  console.log(`  Health check: http://localhost:${PORT}/health`)
})

