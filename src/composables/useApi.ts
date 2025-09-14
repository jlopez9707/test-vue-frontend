import { ref } from 'vue'
import axios, { AxiosRequestConfig, Method } from 'axios'

export function useApi<T, U = unknown>(
  url: string,
  method: Method = 'GET',
  config?: AxiosRequestConfig
) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async (payload?: U) => {
    loading.value = true
    error.value = null
    try {
      const options: AxiosRequestConfig = {
        ...config,
        method,
        url,
      }

      if (payload && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
        options.data = payload
      }

      const response = await axios.request<T>(options)
      data.value = (response.data as any).data ?? response.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error en la petición'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
