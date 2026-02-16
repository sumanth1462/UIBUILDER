import React, { useState } from 'react'
import { useUIBuilderStore } from '../store'
import { downloadFile, copyToClipboard } from '../utils'
import styles from './CodeGenerator.module.css'

export const CodeGenerator: React.FC = () => {
  const { generatedCode } = useUIBuilderStore()
  const [copied, setCopied] = useState(false)

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

  if (!generatedCode) {
    return (
      <div className={styles.codeGeneratorContainer}>
        <div className={styles.emptyCodeState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.codeIcon}>
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <p>Upload a design and analyze it to generate code</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.codeGeneratorContainer}>
      <div className={styles.header}>
        <h2>Generated Code</h2>
      </div>

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
    </div>
  )
}

export default CodeGenerator
