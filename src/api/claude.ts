import axios from 'axios'
import type { DesignAnalysisResult, GeneratedCode } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const geminiApi = {
  async analyzeDesign(
    imageUrl: string,
    framework: 'angular' | 'flutter' | 'react' | 'html',
    outputFormat: 'json' | 'code',
    description?: string
  ): Promise<DesignAnalysisResult | GeneratedCode> {
    try {
      const response = await axios.post(`${API_URL}/api/analyze-design`, {
        imageUrl,
        framework,
        outputFormat,
        description,
      })

      return response.data
    } catch (error) {
      console.error('Error analyzing design:', error)
      throw error
    }
  },
}

export default geminiApi

