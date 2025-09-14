<template>
    <div class="h-screen flex items-center justify-center">
        <div class="w-full max-w-lg p-6 space-y-6">

            <q-card flat bordered class="p-4 space-y-4">
                <div class="text-xl font-semibold">{{ t('keywords') }}</div>

                <q-input v-model="newKeyword" :label="t('newKeyword')" outlined dense />
                <div class="flex items-center space-x-2">
                    <q-btn color="secondary" :label="t('addKeyword')" :loading="creatingKeyword" @click="addKeyword" />
                    <p v-if="keywordError" class="text-red-600 text-sm">{{ keywordError }}</p>
                </div>

                <q-spinner v-if="loadingKeywords" color="primary" size="24px" class="mt-4" />
                <q-list v-else bordered separator class="mt-4">
                    <q-item v-for="kw in keywords" :key="kw.id">
                        <q-item-section>{{ kw.name }}</q-item-section>
                    </q-item>
                    <p v-if="keywordListError" class="text-red-600 text-sm mt-2">{{ keywordListError }}</p>
                </q-list>
                <p v-if="!loadingKeywords && keywords?.length === 0" class="text-gray-500 text-sm mt-2">{{
                    t('noKeywords') }}</p>
            </q-card>

            <q-card flat bordered class="p-4 space-y-4">
                <div class="text-xl font-semibold">{{ t('newTask') }}</div>

                <q-input v-model="newTask" :label="t('taskTitle')" outlined dense />

                <q-select v-model="selectedKeywords" :options="keywordOptions" option-value="id" option-label="name"
                    multiple outlined use-chips emit-value map-options :label="t('selectKeywords')"
                    :loading="loadingKeywords" class="mt-2" />

                <div class="flex items-center space-x-2 mt-2">
                    <q-btn color="primary" :label="t('createTask')" :loading="creatingTask" @click="addTask" />
                    <p v-if="taskError" class="text-red-600 text-sm">{{ taskError }}</p>
                </div>
            </q-card>

            <q-card flat bordered class="p-4 space-y-4">
                <div class="text-xl font-semibold">{{ t('tasks') }}</div>

                <q-spinner v-if="loadingTasks" color="primary" size="30px" class="mt-2" />
                <p v-else-if="tasksError" class="text-red-600 text-sm mt-2">{{ tasksError }}</p>

                <q-list v-else bordered separator class="mt-2 space-y-2">
                    <q-item v-for="task in tasks" :key="task.id" class="items-center">
                        <q-item-section>
                            <div class="font-medium">{{ task.title }}</div>
                            <div class="text-gray-500 text-sm">
                                {{ t('keywordsLabel') }}
                                <span v-if="task.keywords?.length">{{task.keywords.map(k => k.name).join(', ')
                                    }}</span>
                                <span v-else>—</span>
                            </div>
                        </q-item-section>

                        <q-item-section side>
                            <q-btn size="sm" :color="task.is_done ? 'positive' : 'warning'"
                                :label="task.is_done ? t('completed') : t('pending')" @click="toggleStatus(task)"
                                :loading="togglingIds.has(task.id)" />
                        </q-item-section>
                    </q-item>
                </q-list>

                <p v-if="!loadingTasks && tasks?.length === 0" class="text-gray-500 text-sm mt-2">{{ t('noTasks') }}</p>
            </q-card>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTasksAndKeywords } from '@/composables/useTasksAndKeywords'

const API_URL = process.env.VUE_APP_BACKEND_API_BASE_URL as string
const { t } = useI18n()

const {
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
    toggleStatus
} = useTasksAndKeywords(API_URL)
</script>