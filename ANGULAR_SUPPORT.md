# Angular Support with Tailwind CSS

## Overview
UIBuilder now supports Angular framework with automatic Tailwind CSS class generation and framework-specific JSON template format.

## Features

### 1. Angular Template JSON Format
When generating code for Angular with **JSON output format**, you get a template-based structure:

```json
{
  "version": "1.0.0",
  "type": "angular-template",
  "templates": [
    {
      "element": "button",
      "text": "Click Me",
      "classNames": ["px-4", "py-2", "rounded", "bg-blue-500", "text-white"],
      "attributes": [],
      "listeners": [
        {
          "eventName": "click",
          "callBack": "handleButtonClick()"
        }
      ],
      "children": []
    },
    {
      "element": "span",
      "text": "Some Text",
      "classNames": ["text-lg", "font-bold", "text-slate-800"],
      "attributes": [],
      "listeners": [],
      "children": []
    }
  ],
  "metadata": {
    "totalElements": 2,
    "exportedAt": "2026-02-16T...",
    "tailwindEnabled": true
  }
}
```

### 2. Tailwind CSS Class Mapping
Automatic conversion from design properties to Tailwind classes:

| Property | Tailwind Classes |
|----------|----------------------|
| Button | `px-4 py-2 rounded font-medium` + color classes |
| Input | `px-3 py-2 border rounded focus:outline-none focus:ring-2` |
| Text Large (24px+) | `text-2xl text-xl text-lg` |
| Text Bold | `font-bold` |
| Container/Card | `flex flex-col` + card styling |
| Padding 24px | `p-6` |
| Padding 16px | `p-4` |
| Border Radius 16px+ | `rounded-lg` |

### 3. Event Listeners
Automatic listener generation for interactive elements:

```typescript
// For buttons
{
  "eventName": "click",
  "callBack": "handleButtonClick()"
}

// For inputs
{
  "eventName": "change",
  "callBack": "handleInputChange($event)"
}
```

### 4. Color Mapping
Hex to Tailwind color mapping:

```typescript
#0ea5e9 -> sky-500
#3b82f6 -> blue-500
#ef4444 -> red-500
#10b981 -> green-500
#1e293b -> slate-800
#475569 -> slate-600
#ffffff -> white
// ... and more
```

## Usage Workflow

### Step 1: Upload Design
Upload an image or Figma file through the Upload Section.

### Step 2: Analyze Design
Click "Analyze Design" to extract UI elements using Gemini AI.

### Step 3: Generate Code
In the Code Generator:
1. Select **Framework**: `Angular`
2. Select **Output Format**: `JSON` (for template) or `Code` (for component files)
3. Click **Generate Code**

### Step 4: Preview in Playground
1. Go to **Playground** tab
2. Select **Angular** framework
3. For JSON format: Paste the generated JSON and click "Run"
4. Preview updates with Tailwind-styled components

## Angular Component Structure

### Generated Files

**component.html** (with Tailwind classes):
```html
<div class="space-y-4 p-6">
  <button class="px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600 transition" (click)="handleButtonClick()">
    Button Label
  </button>
  <span class="text-lg font-bold text-slate-800">
    Heading Text
  </span>
</div>
```

**component.ts** (with event handlers):
```typescript
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-uicomponent',
  templateUrl: './uicomponent.component.html',
  styleUrls: ['./uicomponent.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class UIComponentComponent {
  constructor() {}

  handleButtonClick(): void {
    console.log('Button clicked')
  }

  handleInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    console.log('Input changed:', value)
  }
}
```

**component.css** (Tailwind directives):
```css
:host {
  display: block;
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600 transition;
  }
  
  .form-input {
    @apply px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

## Playground Usage Examples

### Example 1: Simple Angular Button
```json
{
  "version": "1.0.0",
  "type": "angular-template",
  "templates": [
    {
      "element": "button",
      "text": "Submit",
      "classNames": ["px-4", "py-2", "rounded", "bg-blue-500", "text-white"],
      "listeners": [
        {
          "eventName": "click",
          "callBack": "handleSubmit()"
        }
      ]
    }
  ]
}
```

### Example 2: Form Input with Label
```json
{
  "version": "1.0.0",
  "type": "angular-template",
  "templates": [
    {
      "element": "span",
      "text": "Email Address",
      "classNames": ["text-sm", "font-bold", "text-slate-700"]
    },
    {
      "element": "input",
      "classNames": ["px-3", "py-2", "border", "border-gray-300", "rounded"],
      "attributes": [
        {
          "name": "type",
          "value": "email"
        },
        {
          "name": "placeholder",
          "value": "Enter your email"
        }
      ],
      "listeners": [
        {
          "eventName": "change",
          "callBack": "handleEmailChange($event)"
        }
      ]
    }
  ]
}
```

## Implementation Details

### JSON Generation (Framework-Specific)
The `generateCode()` function in `src/generator/index.ts` now accepts a `framework` parameter:

```typescript
function generateJSON(elements: DesignElement[], framework: string = 'react'): string {
  if (framework === 'angular') {
    // Returns Angular template format
    return generateAngularJSON(elements)
  }
  // Returns default format for other frameworks
  return generateDefaultJSON(elements)
}
```

### Tailwind Class Generation
The `getTailwindClasses()` function converts design properties to Tailwind classes:

```typescript
function getTailwindClasses(el: DesignElement): string[] {
  const classes: string[] = []
  // Type-specific classes
  // Spacing (padding, margin)
  // Colors
  // Border radius
  return classes
}
```

### Template-to-Element Conversion
The Playground component can parse Angular templates back to internal element format:

```typescript
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
    children: template.children?.map(angularTemplateToElement),
  }
}
```

## Framework Comparison

| Feature | Flutter | React | Angular | HTML |
|---------|---------|-------|---------|------|
| JSON Format | Flutter Widget Tree | Generic Elements | Template Structure | Generic Elements |
| CSS | N/A | Inline/CSS Modules | Tailwind Classes | CSS |
| Live Preview | DartPad iframe | HTML Simulation | HTML with Tailwind | HTML Preview |
| Event Handling | onPressed, etc | onClick, onChange | (click), (change) | onclick, onchange |

## Next Steps

1. **Copy Generated Code**: Download the generated component files
2. **Install Tailwind**: Add Tailwind CSS to your Angular project
3. **Import Component**: Use the component in your Angular app
4. **Customize**: Modify classNames, add business logic, style further

## Troubleshooting

### JSON Parse Errors
- Ensure valid JSON format with proper quotes
- Check for unescaped special characters
- Use JSON formatter to validate

### Tailwind Classes Not Applying
- Ensure Tailwind CSS is installed: `npm install -D tailwindcss postcss autoprefixer`
- Configure `tailwind.config.js` to include component templates
- Import Tailwind CSS in main styles

### Event Listeners Not Working
- Ensure handler methods are defined in the component class
- Use proper Angular event binding syntax: `(eventName)="method()"`
- Check console for binding errors

