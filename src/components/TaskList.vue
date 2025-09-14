<template>
    <div class="q-pa-md" style="max-width: 600px">
        <q-card flat bordered class="q-pa-md q-mb-lg">
            <div class="text-h6 q-mb-sm">Palabras clave</div>

            <q-input v-model="newKeyword" label="Nueva keyword" outlined dense />
            <div class="q-mt-sm">
                <q-btn color="secondary" label="Agregar keyword" :loading="creatingKeyword" @click="addKeyword" />
                <p v-if="keywordError" class="text-negative q-mt-sm">{{ keywordError }}</p>
            </div>

            <q-spinner v-if="loadingKeywords" color="primary" size="24px" class="q-mt-md" />
            <q-list v-else bordered separator class="q-mt-md">
                <q-item v-for="kw in keywords" :key="kw.id">
                    <q-item-section>{{ kw.name }}</q-item-section>
                </q-item>
                <p v-if="keywordListError" class="text-negative q-mt-sm">{{ keywordListError }}</p>
            </q-list>
            <p v-if="!loadingKeywords && keywords?.length === 0" class="q-mt-sm">No hay keywords</p>
        </q-card>

        <q-card flat bordered class="q-pa-md q-mb-lg">
            <div class="text-h6 q-mb-sm">Nueva tarea</div>

            <q-input v-model="newTask" label="Título de la tarea" outlined dense />

            <q-select v-model="selectedKeywords" :options="keywordOptions" option-value="id" option-label="name" multiple
                outlined use-chips emit-value map-options class="q-mt-sm" label="Selecciona keywords"
                :loading="loadingKeywords" />

            <div class="q-mt-md">
                <q-btn color="primary" label="Crear tarea" :loading="creatingTask" @click="addTask" />
                <p v-if="taskError" class="text-negative q-mt-sm">{{ taskError }}</p>
            </div>
        </q-card>

        <q-card flat bordered class="q-pa-md">
            <div class="text-h6 q-mb-sm">Tareas</div>

            <q-spinner v-if="loadingTasks" color="primary" size="30px" />
            <p v-else-if="tasksError" class="text-negative">{{ tasksError }}</p>

            <q-list v-else bordered separator>
                <q-item v-for="task in tasks" :key="task.id" class="items-center">
                    <q-item-section>
                        <div class="text-weight-medium">{{ task.title }}</div>
                        <div class="text-caption text-grey">
                            Palabras clave:
                            <span v-if="task.keywords?.length">
                                {{task.keywords.map(k => k.name).join(', ')}}
                            </span>
                            <span v-else>—</span>
                        </div>
                    </q-item-section>

                    <q-item-section side>
                        <q-btn size="sm" :color="task.is_done ? 'positive' : 'warning'"
                            :label="task.is_done ? 'Completada' : 'Pendiente'" @click="toggleStatus(task)"
                            :loading="togglingIds.has(task.id)" />
                    </q-item-section>
                </q-item>
            </q-list>

            <p v-if="!loadingTasks && tasks?.length === 0" class="q-mt-md">No hay tareas</p>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Task, Keyword } from '@/types'

const API_URL = process.env.VUE_APP_BACKEND_API_BASE_URL as string

const {
    data: keywords,
    loading: loadingKeywords,
    error: keywordListError,
    fetchData: fetchKeywords
} = useApi<Keyword[]>(`${API_URL}/keywords`)

const {
    loading: creatingKeyword,
    error: keywordError,
    fetchData: createKeyword
} = useApi<Keyword, { name: string }>(`${API_URL}/keywords`, 'POST')

const newKeyword = ref('')
const newTask = ref('')
const selectedKeywords = ref<number[]>([])
const keywordOptions = computed(() => keywords.value ?? [])

const togglingIds = ref<Set<number>>(new Set())

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
} = useApi<Task[]>(`${API_URL}/tasks`)

const {
    loading: creatingTask,
    error: taskError,
    fetchData: createTask
} = useApi<Task, { title: string; keyword_ids: number[] }>(
    `${API_URL}/tasks`,
    'POST'
)

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
        `${API_URL}/tasks/${task.id}/toggle`,
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
</script>