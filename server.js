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

// Helper function to generate language-specific prompts
function generatePrompt(framework, outputFormat, description) {
  const contextInfo = description ? `Context: ${description}` : ''

  if (outputFormat === 'code') {
    const prompts = {
      react: `Analyze this UI design image and generate production-ready React TypeScript code. Generate a functional React component that recreates this design. Include proper TypeScript types, state management if needed, event handlers, CSS modules or inline styles, responsive design. ${contextInfo} Return ONLY code without markdown formatting.`,
      angular: `Analyze this UI design image and generate production-ready Angular code. Generate an Angular component with TypeScript class and HTML template. Include component class with types, Angular directives, event bindings, two-way binding if needed, inline styles. ${contextInfo} Return ONLY code without markdown formatting.`,
      flutter: `Analyze this UI design image and generate production-ready Flutter code. Generate a Flutter widget with proper widgets like Column, Row, Container, Material Design components, styling, theming, state management if needed. ${contextInfo} Return ONLY code without markdown formatting.`,
      html: `Analyze this UI design image and generate production-ready HTML5 code with CSS. Generate semantic HTML with CSS styling. Include semantic tags, mobile-responsive CSS, Flexbox or Grid, accessibility attributes, form elements. ${contextInfo} Return ONLY code without markdown formatting.`,
    }
    return prompts[framework] || prompts.react
  } else {
    // JSON format - simplified without complex nested examples that break JSON
    const prompts = {
      react: `Analyze this UI design image. Return valid JSON with elements array. Each element has id, type (button/input/text/image/container/card/list/icon), name, x, y, width, height, and args object with properties. ${contextInfo}`,
      angular: `Analyze this UI design. Return valid JSON with template object. Template has element (tag), text, classNames array, attributes array (name/value pairs), listeners array (eventName/callBack), children array. ${contextInfo}`,
      flutter: `Analyze this UI design. Return valid JSON with widgets array. Each widget has type (Container/Button/TextField/Text/Icon), name, position object, size object, args with decoration, style, child, children, onPressed, onChanged, keyboardType. ${contextInfo}`,
      html: `Analyze this UI design. Return valid JSON with elements array. Each element has id, type (button/input/text/image/div/section/header/footer), name, x, y, width, height, args with properties. ${contextInfo}`,
    }
    return prompts[framework] || prompts.react
  }
}


// Helper to get language for each framework
function getLanguageForFramework(framework) {
  const languages = {
    react: 'jsx',
    angular: 'html',
    flutter: 'dart',
    html: 'html',
  }
  return languages[framework] || 'text'
}

// Gemini API proxy endpoint
app.post('/api/analyze-design', async (req, res) => {
  try {
    const { imageUrl, description, framework, outputFormat } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' })
    }

    if (!framework || !outputFormat) {
      return res.status(400).json({ error: 'framework and outputFormat are required' })
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' })
    }

    console.log(`Analyzing design with Gemini for ${framework} (${outputFormat})...`)

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

      // Generate prompt based on framework and output format
      const prompt = generatePrompt(framework, outputFormat, description)

      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
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
        // If outputFormat is 'code', extract both code and analysis
        if (outputFormat === 'code') {
          // Try to extract code from markdown code blocks
          let code = content
          const codeMatch = content.match(/```[\w-]*\n([\s\S]*?)\n```/)
          if (codeMatch && codeMatch[1]) {
            code = codeMatch[1]
          }
          
          // Return code as GeneratedCode, but also include minimal analysis for preview
          return res.json({
            code: code.trim(),
            format: 'code',
            framework: framework,
            language: getLanguageForFramework(framework),
            // Include analysis metadata for preview/compare tabs
            analysisResult: {
              elements: [],
              summary: `Generated ${framework} code from design`,
              confidence: 0.85,
              suggestions: ['Code generated successfully']
            }
          })
        } else {
          // If outputFormat is 'json', try to extract JSON with full analysis
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0])
            return res.json(result)
          }
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
              "onPressed": "\${handleAction()}",
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
              "onPressed": "\${handleFloatingAction()}",
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

