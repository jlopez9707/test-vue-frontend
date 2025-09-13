import { ref } from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

export function useFetch<T>(url: string, config?: AxiosRequestConfig) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get<T>(url, config)
      data.value = (response.data as any).data ?? response.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error fetching data'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
