import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUIBuilderStore } from '../store'
import { convertFileToBase64 } from '../utils'
import styles from './UploadSection.module.css'

export const UploadSection: React.FC = () => {
  const { setCurrentDocument, setLoading, setError } = useUIBuilderStore()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setError(null)
      setLoading(true)

      try {
        const base64 = await convertFileToBase64(file)

        setCurrentDocument({
          id: `doc-${Date.now()}`,
          name: file.name,
          source: 'image',
          imageUrl: base64,
          elements: [],
          metadata: {
            width: 1920,
            height: 1080,
            createdAt: new Date().toISOString(),
          },
        })
      } catch (err) {
        setError(`Failed to process file: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    },
    [setCurrentDocument, setLoading, setError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
  })

  return (
    <div className={styles.uploadSection}>
      <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
        <input {...getInputProps()} />
        <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <h3>Drag and drop your design</h3>
        <p>or click to select an image or Figma file</p>
        <small>Supports PNG, JPG, GIF, WebP</small>
      </div>

      <div className={styles.alternativeInput}>
        <input
          type="text"
          placeholder="Or paste Figma URL..."
          onPaste={(e) => {
            const text = e.clipboardData.getData('text')
            if (text.includes('figma.com')) {
              setCurrentDocument({
                id: `doc-${Date.now()}`,
                name: 'Figma Design',
                source: 'figma',
                figmaUrl: text,
                elements: [],
                metadata: {
                  width: 1920,
                  height: 1080,
                  createdAt: new Date().toISOString(),
                },
              })
            }
          }}
        />
      </div>
    </div>
  )
}

export default UploadSection
