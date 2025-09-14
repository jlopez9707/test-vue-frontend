<template>
    <div class="h-screen flex items-center justify-center">
        <div class="w-full max-w-4xl p-6 space-y-6">

            <q-form ref="taskForm" @submit.prevent="addTask">
                <q-card flat bordered class="p-6 space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="text-xl font-semibold">{{ t('newTask') }}</div>
                        <q-btn flat icon="add" color="primary" class="mt-4 sm:mt-0" @click="showKeywordModal = true"
                            :label="t('addKeyword')" />
                    </div>

                    <q-input v-model="newTask" :label="t('taskTitle')" outlined dense class="w-full"
                        :rules="[validateTask]" lazy-rules />

                    <q-select v-model="selectedKeywords" :options="keywordOptions" option-value="id" option-label="name"
                        multiple outlined use-chips emit-value map-options :label="t('selectKeywords')"
                        :loading="loadingKeywords" class="w-full mt-2" />

                    <div class="flex items-center space-x-2 mt-2">
                        <q-btn color="primary" :label="t('createTask')" :loading="creatingTask" type="submit" />
                        <p v-if="taskError" class="text-red-600 text-sm">{{ taskError }}</p>
                    </div>
                </q-card>
            </q-form>

            <q-card flat bordered class="p-6 space-y-4">
                <div class="flex justify-between">
                    <span class="text-xl font-semibold">{{ t('tasks') }}</span>
                    <div class="flex gap-2">
                        <q-toggle :model-value="true" color="green" :label="t('completed')" readonly dense />
                        <q-toggle :model-value="false" color="green" :label="t('pending')" readonly dense />
                    </div>
                </div>

                <q-spinner v-if="loadingTasks" color="primary" size="30px" class="mt-2" />
                <p v-else-if="tasksError" class="text-red-600 text-sm mt-2">{{ tasksError }}</p>

                <q-list v-else bordered separator class="mt-2 space-y-2 max-h-[60vh] overflow-auto">
                    <q-item v-for="task in tasks" :key="task.id" class="flex items-center justify-between">

                        <q-item-section side class="flex-shrink-0">
                            <q-toggle v-model="task.is_done" color="positive" dense
                                @update:model-value="toggleStatus(task)" />
                        </q-item-section>

                        <q-item-section class="flex-1 min-w-0 ml-2">
                            <div class="font-medium truncate">{{ task.title }}</div>
                            <div class="text-gray-500 text-sm truncate">
                                {{ t('keywordsLabel') }}
                                <span v-if="task.keywords?.length">
                                    {{task.keywords.map(k => k.name).join(', ')}}
                                </span>
                                <span v-else>—</span>
                            </div>
                        </q-item-section>

                    </q-item>
                </q-list>

                <p v-if="!loadingTasks && tasks?.length === 0" class="text-gray-500 text-sm mt-2">{{ t('noTasks') }}</p>
            </q-card>

            <q-dialog v-model="showKeywordModal">
                <q-card class="q-pa-md w-full max-w-sm">
                    <div class="text-lg font-semibold mb-2">{{ t('newKeyword') }}</div>

                    <q-form ref="keywordForm" @submit.prevent="handleAddKeyword">
                        <q-input v-model="newKeyword" :label="t('keywordName')" outlined dense class="w-full"
                            :rules="[validateKeyword]" lazy-rules />

                        <div class="flex justify-end items-center space-x-2 mt-4">
                            <q-btn flat label="Cancelar" color="grey" v-close-popup />
                            <q-btn color="primary" :label="t('addKeyword')" :loading="creatingKeyword" type="submit" />
                        </div>
                    </q-form>

                    <p v-if="keywordError" class="text-red-600 text-sm mt-2">{{ keywordError }}</p>
                </q-card>
            </q-dialog>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTasksAndKeywords } from '@/composables/useTasksAndKeywords'

const API_URL = process.env.VUE_APP_BACKEND_API_BASE_URL as string
const { t } = useI18n()

const {
    newKeyword,
    keywordOptions,
    addKeyword,
    validateKeyword,
    loadingKeywords,
    creatingKeyword,
    keywordError,

    newTask,
    selectedKeywords,
    addTask,
    validateTask,
    tasks,
    loadingTasks,
    creatingTask,
    tasksError,
    taskError,
    toggleStatus
} = useTasksAndKeywords(API_URL)

const showKeywordModal = ref(false)

const handleAddKeyword = async () => {
    const valid = validateKeyword()
    if (valid !== true) return

    await addKeyword()
    showKeywordModal.value = false
}

</script>