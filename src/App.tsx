import { useUIBuilderStore } from './store'
import { geminiApi } from './api/claude'
import type { DesignAnalysisResult } from './types'
import UploadSection from './components/UploadSection'
import DesignPreview from './components/DesignPreview'
import CodeGenerator from './components/CodeGenerator'
import Playground from './components/Playground'
import ComparisonView from './components/ComparisonView'
import './App.css'

function App() {
  const {
    currentDocument,
    setAnalysisResult,
    setGeneratedCode,
    setLoading,
    setError,
    loading,
    error,
    activeTab,
    setActiveTab,
    analysisResult,
    generatedCode,
  } = useUIBuilderStore()

  const handleAnalyzeDesign = async () => {
    if (!currentDocument?.imageUrl) {
      setError('No image to analyze')
      return
    }

    if (!currentDocument.framework || !currentDocument.outputFormat) {
      setError('Please select framework and output format')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await geminiApi.analyzeDesign(
        currentDocument.imageUrl,
        currentDocument.framework,
        currentDocument.outputFormat,
        currentDocument.metadata.description
      )

      console.log('analyzeDesign result:', result)

      // Handle response with both code and analysis
      if ('code' in result && 'framework' in result) {
        // It's GeneratedCode response
        const codeResult = result as any
        setGeneratedCode(codeResult)
        
        // Also set analysis result if included (for preview/compare tabs)
        if (codeResult.analysisResult) {
          console.log('setting analysisResult from codeResult.analysisResult', codeResult.analysisResult)
          setAnalysisResult(codeResult.analysisResult)
        } else {
          console.log('no analysisResult in codeResult')
        }
        
        setActiveTab('code')
      } else {
        // It's DesignAnalysisResult with elements
        const analysisResult = result as DesignAnalysisResult
        console.log('setting analysisResult from result:', analysisResult)
        setAnalysisResult(analysisResult)
        setActiveTab('preview')
      }
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'preview':
        return <DesignPreview />
      case 'code':
        return <CodeGenerator />
      case 'compare':
        return <ComparisonView />
      case 'playground':
        return <Playground />
      default:
        return <DesignPreview />
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
            {analysisResult && (
              <>
                <button
                  className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Design Preview
                </button>
                <button
                  className={`tab ${activeTab === 'compare' ? 'active' : ''}`}
                  onClick={() => setActiveTab('compare')}
                >
                  Compare
                </button>
              </>
            )}
            {generatedCode && (
              <>
                <button
                  className={`tab ${activeTab === 'code' ? 'active' : ''}`}
                  onClick={() => setActiveTab('code')}
                >
                  Generate Code
                </button>
                <button
                  className={`tab ${activeTab === 'playground' ? 'active' : ''}`}
                  onClick={() => setActiveTab('playground')}
                >
                  Playground
                </button>
              </>
            )}
          </div>

          <div className="panel-content">
            {analysisResult && generatedCode ? (
              renderContent()
            ) : !analysisResult ? (
              <DesignPreview />
            ) : (
              <CodeGenerator />
            )}
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
