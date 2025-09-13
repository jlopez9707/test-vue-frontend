import { ref } from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

export function usePost<T, U>(url: string, config?: AxiosRequestConfig) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const postData = async (payload: U) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post<T>(url, payload, config)
      data.value = response.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error posting data'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, postData }
}
