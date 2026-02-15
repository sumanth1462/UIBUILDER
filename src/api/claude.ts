import axios from 'axios'
import type { DesignAnalysisResult } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const geminiApi = {
  async analyzeDesign(imageUrl: string, description?: string): Promise<DesignAnalysisResult> {
    try {
      const response = await axios.post(`${API_URL}/api/analyze-design`, {
        imageUrl,
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

