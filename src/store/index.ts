import { create } from 'zustand'
import type { UIBuilderStore, DesignDocument, DesignAnalysisResult, GeneratedCode, DesignElement, PlaygroundState } from '../types'

export const useUIBuilderStore = create<UIBuilderStore>((set) => ({
  currentDocument: null,
  analysisResult: null,
  generatedCode: null,
  loading: false,
  error: null,
  selectedElement: null,
  activeTab: 'preview',
  playgroundState: null,

  setCurrentDocument: (doc: DesignDocument) =>
    set({ currentDocument: doc, selectedElement: null }),

  updateCurrentDocumentOptions: (framework?: 'angular' | 'flutter' | 'react' | 'html', outputFormat?: 'json' | 'code') =>
    set((state) => ({
      currentDocument: state.currentDocument
        ? {
            ...state.currentDocument,
            framework: framework || state.currentDocument.framework,
            outputFormat: outputFormat || state.currentDocument.outputFormat,
          }
        : null,
    })),

  setAnalysisResult: (result: DesignAnalysisResult) =>
    set({ analysisResult: result }),

  setGeneratedCode: (code: GeneratedCode) =>
    set({ generatedCode: code }),

  setLoading: (loading: boolean) =>
    set({ loading }),

  setError: (error: string | null) =>
    set({ error }),

  setSelectedElement: (element: DesignElement | null) =>
    set({ selectedElement: element }),

  setActiveTab: (tab: 'preview' | 'code' | 'playground' | 'compare') =>
    set({ activeTab: tab }),

  setPlaygroundState: (state: PlaygroundState) =>
    set({ playgroundState: state }),

  updatePlaygroundCode: (code: string) =>
    set((state) => ({
      playgroundState: state.playgroundState
        ? { ...state.playgroundState, code }
        : null,
    })),

  reset: () =>
    set({
      currentDocument: null,
      analysisResult: null,
      generatedCode: null,
      loading: false,
      error: null,
      selectedElement: null,
      activeTab: 'preview',
      playgroundState: null,
    }),
}))

