<template>
    <div class="q-pa-md" style="max-width: 350px">

        <div class="q-pa-md q-gutter-sm">
            <q-input outlined v-model="newTask" label="Outlined" />
            <q-btn color="primary" label="New Task" />
        </div>

        <q-spinner v-if="loading" color="primary" size="30px" />

        <p v-if="error" class="text-negative">{{ error }}</p>

        <q-list v-else-if="tasks?.length" bordered separator>
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
import { ref, onMounted } from 'vue'
import type { Task } from '../types'
import { useFetch } from '@/composables/useFetch'

const API_URL = process.env.VUE_APP_BACKEND_API_BASE_URL as string
const { data: tasks, loading, error, fetchData } = useFetch<Task[]>(`${API_URL}/tasks`)

const newTask = ref("")

onMounted(() => {
    fetchData()
})
</script>