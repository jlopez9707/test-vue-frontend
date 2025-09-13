    <template>
        <div class="q-pa-md" style="max-width: 350px">
        <div class="q-pa-md q-gutter-sm">
            <q-input outlined v-model="newTask" label="Outlined" />
            <q-btn color="primary" label="Primary" />
        </div>
        <q-list v-if="tasks.length > 0" bordered separator>
            <q-item v-for="task in tasks" :key="task.id" clickable v-ripple>
            <q-item-section>{{ task.title }}</q-item-section>
            <q-item-section>{{ task.is_done }}</q-item-section>
            <q-item-section>{{ task.keywords }}</q-item-section>
            </q-item>
        </q-list>
        <p v-else>No tasks</p>

        </div>
    </template>

    <script setup lang="ts">
    import { ref } from 'vue'
    import axios from 'axios'
    import type { Task } from '../types'
    import { onMounted } from 'vue'

    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref(null)
    const newTask = ref("")

    onMounted(() =>{
        fetchUsers()
    })

    const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await axios.get<Task[]>('https://127.0.0.1/api/tasks')
        tasks.value = response.data
    } catch (err) {
        error.value = 'Error al cargar los usuarios'
    } finally {
        loading.value = false
    }
    }
    </script>