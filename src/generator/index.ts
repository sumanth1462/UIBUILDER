import type { DesignElement, GeneratedCode, CodeGenerationOptions } from '../types'

export const generateCode = (
  elements: DesignElement[],
  options: CodeGenerationOptions
): GeneratedCode => {
  let code: string
  let language: string

  switch (options.framework) {
    case 'react':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements)
        language = 'json'
      } else {
        code = generateReactCode(elements, options)
        language = 'jsx'
      }
      break
    case 'angular':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements)
        language = 'json'
      } else {
        code = generateAngularCode(elements, options)
        language = 'html'
      }
      break
    case 'flutter':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements)
        language = 'json'
      } else {
        code = generateFlutterCode(elements, options)
        language = 'dart'
      }
      break
    case 'html':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements)
        language = 'json'
      } else {
        code = generateHTMLCode(elements, options)
        language = 'html'
      }
      break
    default:
      throw new Error(`Unsupported framework: ${options.framework}`)
  }

  return {
    code,
    format: options.outputFormat,
    framework: options.framework,
    language,
  }
}

function generateJSON(elements: DesignElement[]): string {
  const structuredData = {
    version: '1.0.0',
    type: 'ui-design',
    elements: elements.map((el) => ({
      id: el.id,
      type: el.type,
      name: el.name,
      position: {
        x: el.x,
        y: el.y,
      },
      size: {
        width: el.width,
        height: el.height,
      },
      args: el.args,
      children: el.children
        ? el.children.map((child) => ({
            id: child.id,
            type: child.type,
            name: child.name,
            position: {
              x: child.x,
              y: child.y,
            },
            size: {
              width: child.width,
              height: child.height,
            },
            args: child.args,
          }))
        : undefined,
    })),
    metadata: {
      totalElements: elements.length,
      exportedAt: new Date().toISOString(),
    },
  }

  return JSON.stringify(structuredData, null, 2)
}

function generateReactCode(elements: DesignElement[], _options: CodeGenerationOptions): string {
  const componentName = _options.componentName || 'UIComponent'

  const componentCode = elements
    .map((el) => generateReactElement(el))
    .join('\n  ')

  return `import React from 'react'

interface Props {
  // Add props here
}

export const ${componentName}: React.FC<Props> = () => {
  return (
    <div className="ui-container">
      ${componentCode}
    </div>
  )
}

export default ${componentName}`
}

function generateReactElement(el: DesignElement, indent = 3): string {
  const tabs = ' '.repeat(indent)
  const style = generateCSSStyle(el.args)
  const props = `style={${JSON.stringify(style)}}`

  switch (el.type) {
    case 'button':
      return `${tabs}<button ${props}>${el.args.text || 'Button'}</button>`
    case 'input':
      return `${tabs}<input ${props} placeholder="${el.args.placeholder || ''}" />`
    case 'text':
      return `${tabs}<p ${props}>${el.args.text || 'Text'}</p>`
    case 'image':
      return `${tabs}<img ${props} src="${el.args.src || ''}" alt="${el.name}" />`
    case 'container':
    case 'card':
      const children = el.children?.map((child) => generateReactElement(child, indent + 2)).join('\n') || ''
      return `${tabs}<div ${props}>\n${children}\n${tabs}</div>`
    default:
      return `${tabs}<div ${props}>${el.args.text || `${el.type} element`}</div>`
  }
}

function generateAngularCode(elements: DesignElement[], options: CodeGenerationOptions): string {
  const componentName = options.componentName || 'UIComponent'
  const selector = componentName.toLowerCase()

  const templateCode = elements.map((el) => generateAngularElement(el)).join('\n  ')

  return `<!-- ${selector}.component.html -->
<div class="ui-container">
  ${templateCode}
</div>

<!-- ${selector}.component.ts -->
import { Component } from '@angular/core'

@Component({
  selector: 'app-${selector}',
  templateUrl: './${selector}.component.html',
  styleUrls: ['./${selector}.component.css'],
})
export class ${componentName}Component {
  constructor() {}
}

/* ${selector}.component.css */
.ui-container {
  display: flex;
  flex-direction: column;
}`
}

function generateAngularElement(el: DesignElement, indent = 1): string {
  const tabs = ' '.repeat(indent * 2)

  switch (el.type) {
    case 'button':
      return `${tabs}<button [style]="styles.${el.id}">${el.args.text || 'Button'}</button>`
    case 'input':
      return `${tabs}<input [style]="styles.${el.id}" placeholder="${el.args.placeholder || ''}" />`
    case 'text':
      return `${tabs}<p [style]="styles.${el.id}">${el.args.text || 'Text'}</p>`
    case 'container':
    case 'card':
      const children = el.children?.map((child) => generateAngularElement(child, indent + 1)).join('\n') || ''
      return `${tabs}<div [style]="styles.${el.id}">\n${children}\n${tabs}</div>`
    default:
      return `${tabs}<div [style]="styles.${el.id}">${el.args.text || `${el.type} element`}</div>`
  }
}

function generateFlutterCode(elements: DesignElement[], options: CodeGenerationOptions): string {
  const widgetName = options.componentName || 'UIWidget'

  const childrenCode = elements
    .map((el) => generateFlutterWidget(el))
    .join(',\n      ')

  return `import 'package:flutter/material.dart'

class ${widgetName} extends StatelessWidget {
  const ${widgetName}({Key? key}) : super(key: key)

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ${childrenCode},
      ],
    )
  }
}`
}

function generateFlutterWidget(el: DesignElement): string {
  const style = generateFlutterStyle(el.args)

  switch (el.type) {
    case 'button':
      return `ElevatedButton(
        onPressed: () {},
        ${style}
        child: Text('${el.args.text || 'Button'}'),
      )`
    case 'input':
      return `TextField(
        decoration: InputDecoration(
          hintText: '${el.args.placeholder || ''}',
          ${style}
        ),
      )`
    case 'text':
      return `Text(
        '${el.args.text || 'Text'}',
        ${style}
      )`
    case 'image':
      return `Image.network('${el.args.src || ''}', width: ${el.width}, height: ${el.height})`
    case 'container':
    case 'card':
      const children = el.children?.map((child) => generateFlutterWidget(child)).join(',\n        ') || ''
      return `Column(
        children: [
          ${children},
        ],
      )`
    default:
      return `Text('${el.type} element')`
  }
}

function generateHTMLCode(elements: DesignElement[], _options: CodeGenerationOptions): string {
  const elementsCode = elements.map((el) => generateHTMLElement(el)).join('\n  ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated UI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .ui-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="ui-container">
    ${elementsCode}
  </div>
</body>
</html>`
}

function generateHTMLElement(el: DesignElement, indent = 2): string {
  const tabs = ' '.repeat(indent)
  const style = generateCSSStyle(el.args)
  const styleAttr = style ? ` style="${Object.entries(style).map(([k, v]) => `${k}: ${v}`).join('; ')}"` : ''

  switch (el.type) {
    case 'button':
      return `${tabs}<button${styleAttr}>${el.args.text || 'Button'}</button>`
    case 'input':
      return `${tabs}<input type="text"${styleAttr} placeholder="${el.args.placeholder || ''}" />`
    case 'text':
      return `${tabs}<p${styleAttr}>${el.args.text || 'Text'}</p>`
    case 'image':
      return `${tabs}<img src="${el.args.src || ''}" alt="${el.name}"${styleAttr} />`
    case 'container':
    case 'card':
      const childrenCode = el.children?.map((child) => generateHTMLElement(child, indent + 2)).join('\n') || ''
      return `${tabs}<div${styleAttr}>\n${childrenCode}\n${tabs}</div>`
    default:
      return `${tabs}<div${styleAttr}>${el.args.text || `${el.type} element`}</div>`
  }
}

function generateCSSStyle(props: any): Record<string, string> {
  const style: Record<string, string> = {}

  if (props.backgroundColor) style.backgroundColor = props.backgroundColor
  if (props.textColor) style.color = props.textColor
  if (props.borderColor) style.borderColor = props.borderColor
  if (props.borderRadius) style.borderRadius = `${props.borderRadius}px`
  if (props.padding) style.padding = `${props.padding}px`
  if (props.margin) style.margin = `${props.margin}px`
  if (props.fontSize) style.fontSize = `${props.fontSize}px`
  if (props.fontWeight) style.fontWeight = props.fontWeight

  return style
}

function generateFlutterStyle(props: any): string {
  const styles: string[] = []

  if (props.backgroundColor) styles.push(`style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF${props.backgroundColor.slice(1)}))`)
  if (props.fontSize) styles.push(`style: TextStyle(fontSize: ${props.fontSize})`)

  return styles.join(',\n        ')
}
