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
        code = generateJSON(elements, 'react')
        language = 'json'
      } else {
        code = generateReactCode(elements, options)
        language = 'jsx'
      }
      break
    case 'angular':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements, 'angular')
        language = 'json'
      } else {
        code = generateAngularCode(elements, options)
        language = 'html'
      }
      break
    case 'flutter':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements, 'flutter')
        language = 'json'
      } else {
        code = generateFlutterCode(elements, options)
        language = 'dart'
      }
      break
    case 'html':
      if (options.outputFormat === 'json') {
        code = generateJSON(elements, 'html')
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

function generateJSON(elements: DesignElement[], framework: string = 'react'): string {
  if (framework === 'angular') {
    // Angular Template format with Tailwind CSS
    const angularTemplate = {
      version: '1.0.0',
      type: 'angular-template',
      templates: elements.map((el) => elementToAngularTemplate(el)),
      metadata: {
        totalElements: elements.length,
        exportedAt: new Date().toISOString(),
        tailwindEnabled: true,
      },
    }
    return JSON.stringify(angularTemplate, null, 2)
  }

  // Default JSON format for other frameworks
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

// Convert element to Angular Template format
function elementToAngularTemplate(el: DesignElement): any {
  const template: any = {
    element: getHTMLElement(el.type),
    classNames: getTailwindClasses(el),
  }

  // Add text if available
  if (el.args.text) {
    template.text = el.args.text
  }

  // Add attributes
  const attributes: any[] = []
  if (el.args.placeholder) {
    attributes.push({ name: 'placeholder', value: el.args.placeholder })
  }
  if (el.args.disabled) {
    attributes.push({ name: 'disabled', value: 'true' })
  }
  if (el.args.type) {
    attributes.push({ name: 'type', value: el.args.type })
  }
  if (attributes.length > 0) {
    template.attributes = attributes
  }

  // Add event listeners
  if (el.type === 'button') {
    template.listeners = [
      {
        eventName: 'click',
        callBack: 'handleButtonClick()',
      },
    ]
  }
  if (el.type === 'input') {
    template.listeners = [
      {
        eventName: 'change',
        callBack: 'handleInputChange($event)',
      },
    ]
  }

  // Add children
  if (el.children && el.children.length > 0) {
    template.children = el.children.map((child) => elementToAngularTemplate(child))
  }

  return template
}

// Map element type to HTML element
function getHTMLElement(type: string): string {
  const mapping: { [key: string]: string } = {
    button: 'button',
    input: 'input',
    text: 'span',
    image: 'img',
    container: 'div',
    card: 'div',
    list: 'ul',
    icon: 'i',
  }
  return mapping[type] || 'div'
}

// Generate Tailwind CSS classes based on element properties
function getTailwindClasses(el: DesignElement): string[] {
  const classes: string[] = []

  // Base styles based on type
  switch (el.type) {
    case 'button':
      classes.push('px-4', 'py-2', 'rounded', 'font-medium', 'transition')
      if (el.args.backgroundColor) {
        classes.push(getTailwindColor(el.args.backgroundColor, 'bg'))
      } else {
        classes.push('bg-blue-500', 'hover:bg-blue-600')
      }
      if (el.args.textColor) {
        classes.push(getTailwindColor(el.args.textColor, 'text'))
      } else {
        classes.push('text-white')
      }
      break
    case 'input':
      classes.push('px-3', 'py-2', 'border', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')
      classes.push('border-gray-300')
      break
    case 'text':
      if (el.args.fontSize) {
        const size = el.args.fontSize
        if (size >= 28) classes.push('text-2xl')
        else if (size >= 24) classes.push('text-xl')
        else if (size >= 20) classes.push('text-lg')
        else if (size <= 12) classes.push('text-sm')
        else classes.push('text-base')
      }
      if (el.args.fontWeight === 'bold' || el.args.fontWeight === 'w600') {
        classes.push('font-bold')
      }
      if (el.args.textColor) {
        classes.push(getTailwindColor(el.args.textColor, 'text'))
      }
      break
    case 'container':
    case 'card':
      classes.push('flex', 'flex-col')
      if (el.type === 'card') {
        classes.push('rounded-lg', 'shadow', 'p-4')
      }
      if (el.args.backgroundColor) {
        classes.push(getTailwindColor(el.args.backgroundColor, 'bg'))
      }
      break
    case 'image':
      classes.push('object-cover')
      if (el.width) classes.push(`w-[${el.width}px]`)
      if (el.height) classes.push(`h-[${el.height}px]`)
      break
  }

  // Spacing
  if (el.args.padding) {
    const p = el.args.padding
    if (p >= 24) classes.push('p-6')
    else if (p >= 16) classes.push('p-4')
    else if (p >= 12) classes.push('p-3')
    else classes.push('p-2')
  }

  if (el.args.margin) {
    const m = el.args.margin
    if (m >= 16) classes.push('m-4')
    else if (m >= 8) classes.push('m-2')
  }

  // Border radius
  if (el.args.borderRadius) {
    const br = el.args.borderRadius
    if (br >= 16) classes.push('rounded-lg')
    else if (br >= 8) classes.push('rounded-md')
    else if (br > 0) classes.push('rounded')
  }

  return classes
}

// Helper to convert hex/color to Tailwind class
function getTailwindColor(color: string, prefix: 'bg' | 'text' | 'border'): string {
  const hexToTailwind: { [key: string]: string } = {
    '#0ea5e9': 'sky-500',
    '#3b82f6': 'blue-500',
    '#ef4444': 'red-500',
    '#10b981': 'green-500',
    '#f59e0b': 'amber-500',
    '#8b5cf6': 'violet-500',
    '#ec4899': 'pink-500',
    '#1e293b': 'slate-800',
    '#334155': 'slate-700',
    '#475569': 'slate-600',
    '#64748b': 'slate-500',
    '#f1f5f9': 'slate-100',
    '#e2e8f0': 'slate-200',
    '#ffffff': 'white',
  }

  const tailwindColor = hexToTailwind[color.toLowerCase()] || 'gray-500'
  return `${prefix}-${tailwindColor.split('-')[1]}`
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
<div class="space-y-4 p-6">
  ${templateCode}
</div>

<!-- ${selector}.component.ts -->
import { Component } from '@angular/core'

@Component({
  selector: 'app-${selector}',
  templateUrl: './${selector}.component.html',
  styleUrls: ['./${selector}.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ${componentName}Component {
  constructor() {}

  handleButtonClick(): void {
    console.log('Button clicked')
  }

  handleInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    console.log('Input changed:', value)
  }
}

/* ${selector}.component.css */
:host {
  display: block;
}

/* Tailwind directives included in tailwind.css globally */
@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600 transition;
  }
  
  .form-input {
    @apply px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}`
}

function generateAngularElement(el: DesignElement, indent = 1): string {
  const tabs = ' '.repeat(indent * 2)
  const classes = getTailwindClasses(el).join(' ')
  const classAttr = classes ? ` class="${classes}"` : ''

  switch (el.type) {
    case 'button':
      return `${tabs}<button${classAttr} (click)="handleButtonClick()">${el.args.text || 'Button'}</button>`
    case 'input':
      const placeholder = el.args.placeholder || ''
      return `${tabs}<input${classAttr} type="text" placeholder="${placeholder}" (change)="handleInputChange($event)" />`
    case 'text':
      return `${tabs}<span${classAttr}>${el.args.text || 'Text'}</span>`
    case 'image':
      return `${tabs}<img${classAttr} src="${el.args.src || ''}" alt="${el.name}" />`
    case 'container':
    case 'card':
      const children = el.children?.map((child) => generateAngularElement(child, indent + 1)).join('\n') || ''
      return `${tabs}<div${classAttr}>\n${children}\n${tabs}</div>`
    case 'icon':
      return `${tabs}<i${classAttr}></i>`
    default:
      return `${tabs}<div${classAttr}>${el.args.text || `${el.type} element`}</div>`
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
