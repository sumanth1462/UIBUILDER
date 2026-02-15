import { create } from 'zustand'
import type { UIBuilderStore, DesignDocument, DesignAnalysisResult, GeneratedCode, DesignElement } from '../types'

export const useUIBuilderStore = create<UIBuilderStore>((set) => ({
  currentDocument: null,
  analysisResult: null,
  generatedCode: null,
  loading: false,
  error: null,
  selectedElement: null,

  setCurrentDocument: (doc: DesignDocument) =>
    set({ currentDocument: doc, selectedElement: null }),

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

  reset: () =>
    set({
      currentDocument: null,
      analysisResult: null,
      generatedCode: null,
      loading: false,
      error: null,
      selectedElement: null,
    }),
}))
