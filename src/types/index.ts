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

// Angular Template Types
export interface AngularAttribute {
  name: string
  value: string
}

export interface AngularListener {
  eventName: string
  callBack: string
}

export interface AngularTemplate {
  element: string
  text?: string
  classNames?: string[]
  attributes?: AngularAttribute[]
  listeners?: AngularListener[]
  children?: AngularTemplate[]
}

export interface AngularAnalysisResult {
  template: AngularTemplate
  summary: string
  confidence: number
  suggestions?: string[]
}

// Flutter Widget Types
export interface FlutterDecoration {
  color?: string
  borderRadius?: string
  border?: string
  [key: string]: any
}

export interface FlutterStyle {
  color?: string
  fontSize?: number
  fontWeight?: string
  backgroundColor?: string
  padding?: string
  [key: string]: any
}

export interface FlutterWidget {
  type: string
  name: string
  position?: Record<string, any>
  size?: Record<string, any>
  args: {
    decoration?: FlutterDecoration
    style?: FlutterStyle
    child?: FlutterWidget
    children?: FlutterWidget[]
    text?: string
    data?: string
    icon?: string
    color?: string
    onPressed?: string
    onChanged?: string
    keyboardType?: string
    hintText?: string
    contentPadding?: string
    padding?: string | number
    [key: string]: any
  }
}

export interface FlutterAnalysisResult {
  widgets: FlutterWidget[]
  summary: string
  confidence: number
  suggestions?: string[]
}

// Design Document
export interface DesignDocument {
  id: string
  name: string
  source: 'figma' | 'image'
  imageUrl?: string
  figmaUrl?: string
  elements: DesignElement[]
  framework?: 'angular' | 'flutter' | 'react' | 'html'
  outputFormat?: 'json' | 'code'
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

// Playground State
export interface PlaygroundState {
  framework: 'flutter' | 'react' | 'angular' | 'html'
  code: string
  isRunning: boolean
  output?: string
  error?: string
}

// Store State
export interface UIBuilderStore {
  currentDocument: DesignDocument | null
  analysisResult: DesignAnalysisResult | null
  generatedCode: GeneratedCode | null
  loading: boolean
  error: string | null
  selectedElement: DesignElement | null
  activeTab: 'preview' | 'code' | 'playground' | 'compare'
  playgroundState: PlaygroundState | null
  
  // Actions
  setCurrentDocument: (doc: DesignDocument) => void
  updateCurrentDocumentOptions: (framework?: 'angular' | 'flutter' | 'react' | 'html', outputFormat?: 'json' | 'code') => void
  setAnalysisResult: (result: DesignAnalysisResult) => void
  setGeneratedCode: (code: GeneratedCode) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedElement: (element: DesignElement | null) => void
  setActiveTab: (tab: 'preview' | 'code' | 'playground' | 'compare') => void
  setPlaygroundState: (state: PlaygroundState) => void
  updatePlaygroundCode: (code: string) => void
  reset: () => void
}
