import React from 'react'
import { useUIBuilderStore } from '../store'
import UIPreview from './UIPreview'
import styles from './ComparisonView.module.css'

export const ComparisonView: React.FC = () => {
  const { currentDocument, analysisResult, generatedCode } = useUIBuilderStore()

  return (
    <div className={styles.container}>
      <h2>Design Comparison</h2>
      <p className={styles.description}>
        Compare the original design image with the generated code
      </p>

      <div className={styles.comparisonGrid}>
        <div className={styles.section}>
          <h3>Original Design</h3>
          {currentDocument?.imageUrl ? (
            <div className={styles.imageContainer}>
              <img
                src={currentDocument.imageUrl}
                alt="Original Design"
                className={styles.image}
              />
            </div>
          ) : (
            <div className={styles.placeholder}>No design image uploaded</div>
          )}
          <div className={styles.info}>
            <p>Source: {currentDocument?.source}</p>
            <p>Framework: {currentDocument?.framework || 'N/A'}</p>
            <p>Confidence: {analysisResult?.confidence ? `${(analysisResult.confidence * 100).toFixed(0)}%` : 'N/A'}</p>
          </div>
        </div>

        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span>vs</span>
          <div className={styles.dividerLine}></div>
        </div>

        <div className={styles.section}>
          <h3>Generated Code</h3>
          {generatedCode ? (
            <div className={styles.codePreview}>
              <div className={styles.codeInfo}>
                <span className={styles.format}>{generatedCode.language.toUpperCase()}</span>
                <span className={styles.framework}>{generatedCode.framework}</span>
              </div>
              <pre className={styles.codeSnippet}>
                <code>{generatedCode.code.substring(0, 500)}...</code>
              </pre>
            </div>
          ) : analysisResult?.elements && analysisResult.elements.length > 0 ? (
            <div className={styles.previewWrapper}>
              <UIPreview />
            </div>
          ) : (
            <div className={styles.placeholder}>No code generated yet</div>
          )}
          <div className={styles.info}>
            <p>Generated: {generatedCode ? 'Yes' : 'No'}</p>
            <p>Elements: {analysisResult?.elements?.length || 0}</p>
          </div>
        </div>
      </div>

      {analysisResult?.suggestions && analysisResult.suggestions.length > 0 && (
        <div className={styles.suggestionsBox}>
          <h3>Improvement Suggestions</h3>
          <ul>
            {analysisResult.suggestions.map((suggestion: string, index: number) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ComparisonView
