// Design Element Types
export interface DesignElement {
  id: string
  type: 'button' | 'input' | 'text' | 'image' | 'container' | 'card' | 'list' | 'icon'
  name: string
  x: number
  y: number
  width: number
  height: number
  args: ElementProperties
  children?: DesignElement[]
}

export interface ElementProperties {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  padding?: number
  margin?: number
  fontSize?: number
  fontWeight?: string
  textColor?: string
  text?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  type?: string
  [key: string]: any
}

// Design Document
export interface DesignDocument {
  id: string
  name: string
  source: 'figma' | 'image'
  imageUrl?: string
  figmaUrl?: string
  elements: DesignElement[]
  metadata: {
    width: number
    height: number
    description?: string
    createdAt: string
  }
}

// Code Generation
export interface CodeGenerationOptions {
  framework: 'angular' | 'flutter' | 'react' | 'html'
  outputFormat: 'json' | 'code'
  componentName?: string
}

export interface GeneratedCode {
  code: string
  format: 'json' | 'code'
  framework: string
  language: string
}

// Analysis Result
export interface DesignAnalysisResult {
  elements: DesignElement[]
  summary: string
  confidence: number
  suggestions?: string[]
}

// Store State
export interface UIBuilderStore {
  currentDocument: DesignDocument | null
  analysisResult: DesignAnalysisResult | null
  generatedCode: GeneratedCode | null
  loading: boolean
  error: string | null
  selectedElement: DesignElement | null
  
  // Actions
  setCurrentDocument: (doc: DesignDocument) => void
  setAnalysisResult: (result: DesignAnalysisResult) => void
  setGeneratedCode: (code: GeneratedCode) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedElement: (element: DesignElement | null) => void
  reset: () => void
}
