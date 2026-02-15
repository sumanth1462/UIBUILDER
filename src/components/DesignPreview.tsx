import React from 'react'
import { useUIBuilderStore } from '../store'
import styles from './DesignPreview.module.css'

export const DesignPreview: React.FC = () => {
  const { currentDocument, analysisResult, selectedElement, setSelectedElement } = useUIBuilderStore()

  if (!currentDocument) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.emptyState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.emptyIcon}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <h3>No design uploaded yet</h3>
          <p>Upload an image or Figma design to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.previewContainer}>
      <div className={styles.header}>
        <h2>{currentDocument.name}</h2>
        <span className={styles.source}>{currentDocument.source}</span>
      </div>

      {currentDocument.imageUrl && (
        <div className={styles.imageSection}>
          <img src={currentDocument.imageUrl} alt={currentDocument.name} className={styles.previewImage} />
        </div>
      )}

      {analysisResult && (
        <div className={styles.analysisSection}>
          <h3>Design Analysis</h3>
          <p className={styles.summary}>{analysisResult.summary}</p>

          <div className={styles.confidence}>
            <span>Confidence:</span>
            <div className={styles.confidenceBar}>
              <div
                className={styles.confidenceFill}
                style={{ width: `${analysisResult.confidence * 100}%` }}
              ></div>
            </div>
            <span className={styles.confidencePercent}>
              {(analysisResult.confidence * 100).toFixed(0)}%
            </span>
          </div>

          {analysisResult.elements && analysisResult.elements.length > 0 && (
            <div className={styles.elementsList}>
              <h4>Detected Elements ({analysisResult.elements.length})</h4>
              <div className={styles.elements}>
                {analysisResult.elements.map((element) => (
                  <div
                    key={element.id}
                    className={`${styles.element} ${selectedElement?.id === element.id ? styles.selected : ''}`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <span className={styles.elementType}>{element.type}</span>
                    <span className={styles.elementName}>{element.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
            <div className={styles.suggestions}>
              <h4>Suggestions</h4>
              <ul>
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DesignPreview
