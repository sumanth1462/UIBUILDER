import axios from 'axios'

const FIGMA_API_KEY = import.meta.env.VITE_FIGMA_API_KEY
const FIGMA_API_URL = 'https://api.figma.com/v1'

export const figmaApi = {
  async getFile(fileKey: string) {
    try {
      const response = await axios.get(`${FIGMA_API_URL}/files/${fileKey}`, {
        headers: {
          'X-Figma-Token': FIGMA_API_KEY,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching Figma file:', error)
      throw error
    }
  },

  async getFileImages(fileKey: string) {
    try {
      const response = await axios.get(
        `${FIGMA_API_URL}/files/${fileKey}/images`,
        {
          headers: {
            'X-Figma-Token': FIGMA_API_KEY,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching Figma file images:', error)
      throw error
    }
  },

  async exportNodeAsImage(fileKey: string, nodeId: string, scale: number = 1) {
    try {
      const response = await axios.get(
        `${FIGMA_API_URL}/files/${fileKey}/nodes?ids=${nodeId}`,
        {
          headers: {
            'X-Figma-Token': FIGMA_API_KEY,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error exporting Figma node:', error)
      throw error
    }
  },
}

export default figmaApi
