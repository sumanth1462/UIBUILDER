import React, { useState } from 'react'
import { useUIBuilderStore } from './store'
import { geminiApi } from './api/claude'
import UploadSection from './components/UploadSection'
import DesignPreview from './components/DesignPreview'
import CodeGenerator from './components/CodeGenerator'
import './App.css'

function App() {
  const { currentDocument, setAnalysisResult, setLoading, setError, loading, error } = useUIBuilderStore()
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleAnalyzeDesign = async () => {
    if (!currentDocument?.imageUrl) {
      setError('No image to analyze')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await geminiApi.analyzeDesign(
        currentDocument.imageUrl,
        currentDocument.metadata.description
      )
      setAnalysisResult(result)
      setShowAnalysis(true)
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <span className="logo-icon">🎨</span>
            UIBuilder Playground
          </h1>
          <p>Transform designs into production-ready code</p>
        </div>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <UploadSection />

          {currentDocument && (
            <div className="action-buttons">
              <button
                onClick={handleAnalyzeDesign}
                disabled={loading}
                className="analyze-button"
              >
                {loading ? 'Analyzing...' : 'Analyze Design'}
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        <div className="right-panel">
          <div className="panel-tabs">
            <button
              className={`tab ${!showAnalysis ? 'active' : ''}`}
              onClick={() => setShowAnalysis(false)}
            >
              Design Preview
            </button>
            <button
              className={`tab ${showAnalysis ? 'active' : ''}`}
              onClick={() => setShowAnalysis(true)}
            >
              Generate Code
            </button>
          </div>

          <div className="panel-content">
            {!showAnalysis ? <DesignPreview /> : <CodeGenerator />}
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>UIBuilder © 2024 - Design to Code in seconds</p>
      </footer>
    </div>
  )
}

export default App
