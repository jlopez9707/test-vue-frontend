import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '@/composables/useApi'
import type { Task, Keyword } from '@/types'

export function useTasksAndKeywords(apiUrl: string) {
  const { t } = useI18n()

  const {
    data: keywords,
    loading: loadingKeywords,
    error: keywordListError,
    fetchData: fetchKeywords
  } = useApi<Keyword[]>(`${apiUrl}/keywords`)

  const {
    loading: creatingKeyword,
    error: keywordError,
    fetchData: createKeyword
  } = useApi<Keyword, { name: string }>(`${apiUrl}/keywords`, 'POST')

  const newKeyword = ref('')
  const keywordOptions = computed(() => keywords.value ?? [])
  const keywordValidationError = ref('')

  const validateKeyword = (): true | string => {
    const value = newKeyword.value.trim()
    if (!value) return t('keywordRequired')           // al menos una letra
    if (value.length > 50) return t('keywordMaxLength')
    if (!/^[\w\s]+$/.test(value)) return t('keywordInvalid')
    return true
  }

  const addKeyword = async () => {
    const validation = validateKeyword()
    if (validation !== true) {
      keywordValidationError.value = validation
      return
    }
    keywordValidationError.value = ''

    await createKeyword({ name: newKeyword.value.trim() })
    newKeyword.value = ''
    await fetchKeywords()
  }

  const {
    data: tasks,
    loading: loadingTasks,
    error: tasksError,
    fetchData: fetchTasks
  } = useApi<Task[]>(`${apiUrl}/tasks`)

  const {
    loading: creatingTask,
    error: taskError,
    fetchData: createTask
  } = useApi<Task, { title: string; keyword_ids: number[] }>(`${apiUrl}/tasks`, 'POST')

  const newTask = ref('')
  const selectedKeywords = ref<number[]>([])
  const togglingIds = ref<Set<number>>(new Set())
  const taskValidationError = ref('')

  const validateTask = (): true | string => {
    const value = newTask.value.trim()
    if (!value) return t('taskRequired')
    if (value.length < 3) return t('taskMinLength')
    if (value.length > 100) return t('taskMaxLength')
    return true
  }

  const addTask = async () => {
    const validation = validateTask()
    if (validation !== true) {
      taskValidationError.value = validation
      return
    }
    taskValidationError.value = ''

    await createTask({
      title: newTask.value.trim(),
      keyword_ids: selectedKeywords.value
    })
    newTask.value = ''
    selectedKeywords.value = []
    await fetchTasks()
  }

  const toggleStatus = async (task: Task) => {
    togglingIds.value.add(task.id)
    const { fetchData } = useApi<Task, { is_done: boolean }>(
      `${apiUrl}/tasks/${task.id}/toggle`,
      'PATCH'
    )
    await fetchData({ is_done: !task.is_done })
    togglingIds.value.delete(task.id)
    await fetchTasks()
  }

  onMounted(() => {
    fetchKeywords()
    fetchTasks()
  })

  return {
    newKeyword,
    keywordOptions,
    addKeyword,
    validateKeyword,
    keywordValidationError,
    loadingKeywords,
    creatingKeyword,
    keywordError,
    keywordListError,

    newTask,
    selectedKeywords,
    addTask,
    validateTask,
    taskValidationError,
    tasks,
    loadingTasks,
    creatingTask,
    tasksError,
    taskError,
    toggleStatus,
    togglingIds,
  }
}
