import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Task, Keyword } from '@/types'

export function useTasksAndKeywords(apiUrl: string) {
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

  const addKeyword = async () => {
    if (!newKeyword.value.trim()) return
    await createKeyword({ name: newKeyword.value })
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
  } = useApi<Task, { title: string; keyword_ids: number[] }>(
    `${apiUrl}/tasks`,
    'POST'
  )

  const newTask = ref('')
  const selectedKeywords = ref<number[]>([])
  const togglingIds = ref<Set<number>>(new Set())

  const addTask = async () => {
    if (!newTask.value.trim()) return
    await createTask({
      title: newTask.value,
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
    keywords,
    loadingKeywords,
    keywordListError,
    keywordError,
    creatingKeyword,
    newKeyword,
    keywordOptions,
    addKeyword,

    tasks,
    loadingTasks,
    tasksError,
    creatingTask,
    taskError,
    newTask,
    selectedKeywords,
    togglingIds,
    addTask,
    toggleStatus,
  }
}
