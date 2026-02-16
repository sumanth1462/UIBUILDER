import React, { useState, useRef, useEffect } from 'react'
import { useUIBuilderStore } from '../store'
import styles from './Playground.module.css'

interface FlutterElement {
  type: string
  name: string
  args: Record<string, any>
  children?: FlutterElement[]
}

export const Playground: React.FC = () => {
  const { generatedCode, playgroundState, updatePlaygroundCode, setPlaygroundState } = useUIBuilderStore()
  const [code, setCode] = useState(playgroundState?.code || generatedCode?.code || '')
  const [elements, setElements] = useState<FlutterElement[]>([])
  const [error, setError] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [framework, setFramework] = useState<'flutter' | 'react' | 'angular' | 'html'>(
    (generatedCode?.framework as any) || 'flutter'
  )
  const dartPadRef = useRef<HTMLIFrameElement>(null)

  // Send code to DartPad when it's loaded
  useEffect(() => {
    if (framework === 'flutter' && dartPadRef.current && code) {
      const message = {
        type: 'set_code',
        code: code,
      }
      dartPadRef.current.contentWindow?.postMessage(message, '*')
    }
  }, [code, framework])

  const runCode = () => {
    try {
      setError('')
      
      if (framework === 'flutter') {
        // For Flutter, send code to DartPad
        if (dartPadRef.current) {
          const message = {
            type: 'set_code',
            code: code,
          }
          dartPadRef.current.contentWindow?.postMessage(message, '*')
        }
      } else {
        // For other frameworks, parse JSON and render
        setElements([])
        switch (framework) {
          case 'react':
            executeReactCode()
            break
          case 'angular':
            executeAngularCode()
            break
          case 'html':
            executeHTMLCode()
            break
        }
      }

      // Update playground state
      setPlaygroundState({
        framework,
        code,
        isRunning: false,
      })
    } catch (err) {
      setError(`Error executing code: ${err instanceof Error ? err.message : String(err)}`)
    }
  }


  const executeReactCode = () => {
    try {
      const parsed = JSON.parse(code)
      if (parsed.elements && Array.isArray(parsed.elements)) {
        setElements(parsed.elements)
      } else if (Array.isArray(parsed)) {
        setElements(parsed)
      } else {
        throw new Error('JSON must contain array of elements')
      }
    } catch (err) {
      throw new Error(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const executeAngularCode = () => {
    try {
      const parsed = JSON.parse(code)
      // Handle Angular template format
      if (parsed.templates && Array.isArray(parsed.templates)) {
        const convertedElements = parsed.templates.map((template: any) => angularTemplateToElement(template))
        setElements(convertedElements)
      } else if (parsed.elements && Array.isArray(parsed.elements)) {
        setElements(parsed.elements)
      } else if (Array.isArray(parsed)) {
        setElements(parsed)
      } else {
        throw new Error('JSON must contain templates array or elements array')
      }
    } catch (err) {
      throw new Error(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Convert Angular template format back to element format for rendering
  const angularTemplateToElement = (template: any): FlutterElement => {
    return {
      type: htmlToElementType(template.element),
      name: template.element,
      args: {
        text: template.text,
        classNames: template.classNames,
        attributes: template.attributes,
        listeners: template.listeners,
      },
      children: template.children?.map((child: any) => angularTemplateToElement(child)),
    }
  }

  const htmlToElementType = (htmlElement: string): string => {
    const mapping: { [key: string]: string } = {
      button: 'button',
      input: 'input',
      span: 'text',
      p: 'text',
      img: 'image',
      div: 'container',
      ul: 'list',
      i: 'icon',
    }
    return mapping[htmlElement] || 'container'
  }

  const executeHTMLCode = () => {
    try {
      const parsed = JSON.parse(code)
      if (parsed.elements && Array.isArray(parsed.elements)) {
        setElements(parsed.elements)
      } else if (Array.isArray(parsed)) {
        setElements(parsed)
      } else {
        throw new Error('JSON must contain array of elements')
      }
    } catch (err) {
      throw new Error(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleReset = () => {
    setCode(generatedCode?.code || '')
    setElements([])
    setError('')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const renderElement = (element: FlutterElement, index: number): JSX.Element => {
    const { type, name, args } = element
    const children = element.children || args?.children || []
    const childElement = args?.child

    switch (type) {
      case 'Text':
        return (
          <div key={index} style={getStyleFromArgs(args.style)} className={styles.textElement}>
            {args.text || 'Text'}
          </div>
        )

      case 'ElevatedButton':
        return (
          <button
            key={index}
            style={getStyleFromArgs(args.style)}
            className={styles.previewButton}
            onClick={() => alert(`Button clicked: ${name}`)}
          >
            {childElement ? renderElement(childElement, 0) : args.child?.args?.text || 'Button'}
          </button>
        )

      case 'TextField':
        return (
          <input
            key={index}
            type="text"
            className={styles.previewInput}
            placeholder={args.decoration?.hintText || 'Enter text'}
            style={getStyleFromArgs(args.style)}
          />
        )

      case 'Card':
        return (
          <div
            key={index}
            className={styles.previewCard}
            style={{
              ...getStyleFromArgs(args.style),
              boxShadow: `0 ${args.elevation || 2}px ${(args.elevation || 2) * 2}px rgba(0,0,0,0.1)`,
            }}
          >
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Container':
        return (
          <div key={index} style={getStyleFromArgs(args.style)} className={styles.previewContainer}>
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Column':
        return (
          <div key={index} style={getStyleFromArgs(args.style)} className={styles.previewColumn}>
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Row':
        return (
          <div key={index} style={getStyleFromArgs(args.style)} className={styles.previewRow}>
            {childElement && renderElement(childElement, 0)}
            {children && children.map((child, i) => renderElement(child, i))}
          </div>
        )

      case 'Icon':
        return (
          <div
            key={index}
            className={styles.previewIcon}
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
          <div key={index} className={styles.previewChip} style={getStyleFromArgs(args.style)}>
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
            className={styles.previewFab}
            style={getStyleFromArgs(args.style)}
            onClick={() => alert(`FAB clicked: ${name}`)}
          >
            {args.child?.args?.icon || '+'}
          </button>
        )

      default:
        return (
          <div key={index} style={getStyleFromArgs(args.style)} className={styles.defaultElement}>
            {type} - {name}
          </div>
        )
    }
  }

  function getStyleFromArgs(style?: Record<string, any>): React.CSSProperties {
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

  if (isExpanded) {
    return (
      <div className={styles.playgroundExpanded}>
        <div className={styles.expandedHeader}>
          <h2>Code Playground - Expanded View</h2>
          <div className={styles.expandedControls}>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value as any)}
              className={styles.frameworkSelect}
            >
              <option value="flutter">Flutter</option>
              <option value="react">React</option>
              <option value="angular">Angular</option>
              <option value="html">HTML</option>
            </select>
            <button onClick={runCode} className={styles.runButton}>
              ▶ Run
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className={styles.collapseButton}
              title="Collapse"
            >
              ⊟
            </button>
          </div>
        </div>
        <div className={styles.expandedEditorContainer}>
          <div className={styles.codeEditor}>
            <label>Code Editor (JSON/Dart/JSX)</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here and click Run..."
              className={styles.textarea}
              spellCheck="false"
            />
          </div>
          <div className={styles.output}>
            <label>Live Preview</label>
            <div className={styles.outputContent}>
              {framework === 'flutter' ? (
                <iframe
                  ref={dartPadRef}
                  src="https://dartpad.dev/embed-dart.html?theme=dark"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '6px',
                  }}
                  title="Flutter DartPad Preview"
                />
              ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
              ) : elements.length > 0 ? (
                <div className={styles.previewElements}>{elements.map((el, i) => renderElement(el, i))}</div>
              ) : (
                <div className={styles.placeholder}>Click "Run" to preview UI</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <h2>Code Playground</h2>
        <div className={styles.controls}>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as any)}
            className={styles.frameworkSelect}
          >
            <option value="flutter">Flutter</option>
            <option value="react">React</option>
            <option value="angular">Angular</option>
            <option value="html">HTML</option>
          </select>
          <button onClick={runCode} className={styles.runButton}>
            ▶ Run
          </button>
          <button onClick={handleReset} className={styles.resetButton}>
            ↻ Reset
          </button>
          <button onClick={copyCode} className={styles.copyButton}>
            📋 Copy
          </button>
          <button
            onClick={() => setIsExpanded(true)}
            className={styles.expandButton}
            title="Expand preview"
          >
            ⛶
          </button>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.codeEditor}>
          <label>Code Editor (JSON/Dart/JSX)</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here and click Run..."
            className={styles.textarea}
            spellCheck="false"
          />
        </div>

        <div className={styles.output}>
          <label>Live Preview</label>
          <div className={styles.outputContent}>
            {framework === 'flutter' ? (
              <iframe
                ref={dartPadRef}
                src="https://dartpad.dev/embed-dart.html?theme=dark"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '6px',
                }}
                title="Flutter DartPad Preview"
              />
            ) : error ? (
              <div className={styles.errorMessage}>{error}</div>
            ) : elements.length > 0 ? (
              <div className={styles.previewElements}>{elements.map((el, i) => renderElement(el, i))}</div>
            ) : (
              <div className={styles.placeholder}>Click "Run" to preview UI</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h4>How to use:</h4>
        <ul>
          <li><strong>Flutter:</strong> Paste Dart code and click "Run" - uses official DartPad for authentic Flutter preview</li>
          <li><strong>Angular:</strong> Paste Angular template JSON (generated with "JSON" format) and click "Run" - includes Tailwind CSS classes</li>
          <li><strong>React/HTML:</strong> Paste JSON widget structure and click "Run"</li>
          <li>Modify code and run again to see changes</li>
          <li>Use "Reset" to restore original code</li>
          <li>Use "Copy" to copy code to clipboard</li>
          <li>Use "⛶" to expand for a full-screen view</li>
          <li><strong>Tip:</strong> Use CodeGenerator to select framework + output format (Code/JSON) to generate framework-specific output</li>
        </ul>
      </div>
    </div>
  )
}

export default Playground
