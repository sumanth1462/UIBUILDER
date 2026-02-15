import React, { useState } from 'react'
import { useUIBuilderStore } from '../store'
import { generateCode } from '../generator'
import { downloadFile, copyToClipboard } from '../utils'
import styles from './CodeGenerator.module.css'

export const CodeGenerator: React.FC = () => {
  const { analysisResult, setGeneratedCode, generatedCode } = useUIBuilderStore()
  const [framework, setFramework] = useState<'react' | 'angular' | 'flutter' | 'html'>('react')
  const [outputFormat, setOutputFormat] = useState<'code' | 'json'>('code')
  const [copied, setCopied] = useState(false)

  const handleGenerateCode = () => {
    if (!analysisResult || !analysisResult.elements) {
      alert('Please analyze a design first')
      return
    }

    const code = generateCode(analysisResult.elements, {
      framework,
      outputFormat,
      componentName: 'GeneratedComponent',
    })

    setGeneratedCode(code)
  }

  const handleDownload = () => {
    if (!generatedCode) return

    const extension = generatedCode.language === 'jsx' ? 'tsx' : generatedCode.language
    const filename = generatedCode.format === 'json' ? 'design.json' : `component.${extension}`
    downloadFile(generatedCode.code, filename)
  }

  const handleCopy = async () => {
    if (!generatedCode) return

    const success = await copyToClipboard(generatedCode.code)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={styles.codeGeneratorContainer}>
      <div className={styles.header}>
        <h2>Code Generator</h2>
      </div>

      <div className={styles.options}>
        <div className={styles.optionGroup}>
          <label htmlFor="framework">Framework</label>
          <select
            id="framework"
            value={framework}
            onChange={(e) => setFramework(e.target.value as any)}
            disabled={!!generatedCode}
          >
            <option value="react">React</option>
            <option value="angular">Angular</option>
            <option value="flutter">Flutter</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div className={styles.optionGroup}>
          <label htmlFor="format">Output Format</label>
          <select
            id="format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as any)}
            disabled={!!generatedCode}
          >
            <option value="code">Code</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <button
          onClick={handleGenerateCode}
          className={styles.generateButton}
          disabled={!analysisResult}
        >
          Generate Code
        </button>
      </div>

      {generatedCode && (
        <div className={styles.codeSection}>
          <div className={styles.codeHeader}>
            <div className={styles.codeInfo}>
              <span className={styles.language}>{generatedCode.language.toUpperCase()}</span>
              <span className={styles.framework}>{generatedCode.framework}</span>
              {generatedCode.format === 'json' && <span className={styles.format}>JSON Structure</span>}
            </div>
            <div className={styles.actions}>
              <button onClick={handleCopy} className={styles.copyButton} title="Copy to clipboard">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={handleDownload} className={styles.downloadButton} title="Download file">
                Download
              </button>
            </div>
          </div>

          <pre className={styles.codeBlock}>
            <code>{generatedCode.code}</code>
          </pre>
        </div>
      )}

      {!generatedCode && analysisResult && (
        <div className={styles.emptyCodeState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.codeIcon}>
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <p>Select options and click "Generate Code" to see the output</p>
        </div>
      )}
    </div>
  )
}

export default CodeGenerator
