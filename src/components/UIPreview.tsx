import React from 'react'
import { useUIBuilderStore } from '../store'
import styles from './UIPreview.module.css'

interface FlutterElement {
  type: string
  name: string
  args: Record<string, any>
  children?: FlutterElement[]
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export const UIPreview: React.FC = () => {
  const { analysisResult } = useUIBuilderStore()

  if (!analysisResult?.elements || analysisResult.elements.length === 0) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.emptyState}>
          <p>No UI elements to preview</p>
        </div>
      </div>
    )
  }

  const renderElement = (element: FlutterElement, index: number): JSX.Element => {
    const { type, name, args } = element
    // Handle both top-level children and nested children in args
    const children = element.children || args?.children || []
    const childElement = args?.child

    switch (type) {
      case 'Text':
        return (
          <div key={index} className={styles.textElement} style={getStyleFromArgs(args.style)}>
            {args.text || 'Text'}
          </div>
        )

      case 'ElevatedButton':
        return (
          <button
            key={index}
            className={styles.button}
            style={getStyleFromArgs(args.style)}
            onClick={() => console.log(`Button "${name}" clicked`)}
          >
            {childElement ? renderElement(childElement, 0) : args.child?.args?.text || 'Button'}
          </button>
        )

      case 'TextField':
        return (
          <input
            key={index}
            type="text"
            className={styles.input}
            placeholder={args.decoration?.hintText || 'Enter text'}
            style={getStyleFromArgs(args.style)}
          />
        )

      case 'Card':
        return (
          <div
            key={index}
            className={styles.card}
            style={{
              ...getStyleFromArgs(args.style),
              boxShadow: `0 ${args.elevation || 2}px ${(args.elevation || 2) * 2}px rgba(0,0,0,0.1)`,
              borderRadius: args.shape?.borderRadius || '8px',
            }}
          >
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Container':
        return (
          <div
            key={index}
            className={styles.container}
            style={getStyleFromArgs(args.style)}
          >
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Column':
        return (
          <div
            key={index}
            className={styles.column}
            style={getStyleFromArgs(args.style)}
          >
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Row':
        return (
          <div
            key={index}
            className={styles.row}
            style={getStyleFromArgs(args.style)}
          >
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Icon':
        return (
          <div
            key={index}
            className={styles.icon}
            style={{
              width: args.size || 24,
              height: args.size || 24,
              color: args.color || 'currentColor',
            }}
            title={args.icon}
          >
            ⭐
          </div>
        )

      case 'Image':
        return (
          <img
            key={index}
            src={args.src || 'https://via.placeholder.com/180'}
            alt={name}
            style={{
              width: args.width || 180,
              height: args.height || 180,
              objectFit: args.fit || 'cover',
            }}
          />
        )

      case 'Chip':
        return (
          <div
            key={index}
            className={styles.chip}
            style={getStyleFromArgs(args.style)}
          >
            {args.label?.args?.text || 'Chip'}
          </div>
        )

      case 'SizedBox':
        return (
          <div
            key={index}
            style={{
              width: args.width || 'auto',
              height: args.height || '16px',
            }}
          />
        )

      case 'FloatingActionButton':
        return (
          <button
            key={index}
            className={styles.fab}
            style={getStyleFromArgs(args.style)}
            onClick={() => console.log(`FAB "${name}" clicked`)}
          >
            {args.child?.args?.icon || '+'}
          </button>
        )

      default:
        return (
          <div key={index} className={styles.defaultElement} style={getStyleFromArgs(args.style)}>
            {type} - {name}
          </div>
        )
    }
  }

  return (
    <div className={styles.previewContainer}>
      <div className={styles.preview}>
        {(analysisResult.elements as FlutterElement[]).map((element, index) =>
          renderElement(element, index)
        )}
      </div>
    </div>
  )
}

function getStyleFromArgs(
  style?: Record<string, any>
): React.CSSProperties {
  if (!style) return {}

  return {
    backgroundColor: style.backgroundColor,
    color: style.color || style.textColor,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight as any,
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
    padding: style.padding ? `${style.padding}px` : undefined,
    margin: style.margin ? `${style.margin}px` : undefined,
    border: style.borderColor ? `1px solid ${style.borderColor}` : undefined,
  }
}

export default UIPreview
