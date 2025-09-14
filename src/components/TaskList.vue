<template>
    <div class="q-pa-md" style="max-width: 600px">
        <q-card flat bordered class="q-pa-md q-mb-lg">
            <div class="text-h6 q-mb-sm">{{ t('keywords') }}</div>

            <q-input v-model="newKeyword" :label="t('newKeyword')" outlined dense />
            <div class="q-mt-sm">
                <q-btn color="secondary" :label="t('addKeyword')" :loading="creatingKeyword" @click="addKeyword" />
                <p v-if="keywordError" class="text-negative q-mt-sm">{{ keywordError }}</p>
            </div>

            <q-spinner v-if="loadingKeywords" color="primary" size="24px" class="q-mt-md" />
            <q-list v-else bordered separator class="q-mt-md">
                <q-item v-for="kw in keywords" :key="kw.id">
                    <q-item-section>{{ kw.name }}</q-item-section>
                </q-item>
                <p v-if="keywordListError" class="text-negative q-mt-sm">{{ keywordListError }}</p>
            </q-list>
            <p v-if="!loadingKeywords && keywords?.length === 0" class="q-mt-sm">{{ t('noKeywords') }}</p>
        </q-card>

        <q-card flat bordered class="q-pa-md q-mb-lg">
            <div class="text-h6 q-mb-sm">{{ t('newTask') }}</div>

            <q-input v-model="newTask" :label="t('taskTitle')" outlined dense />

            <q-select v-model="selectedKeywords" :options="keywordOptions" option-value="id" option-label="name"
                multiple outlined use-chips emit-value map-options class="q-mt-sm" :label="t('selectKeywords')"
                :loading="loadingKeywords" />

            <div class="q-mt-md">
                <q-btn color="primary" :label="t('createTask')" :loading="creatingTask" @click="addTask" />
                <p v-if="taskError" class="text-negative q-mt-sm">{{ taskError }}</p>
            </div>
        </q-card>

        <q-card flat bordered class="q-pa-md">
            <div class="text-h6 q-mb-sm">{{ t('tasks') }}</div>

            <q-spinner v-if="loadingTasks" color="primary" size="30px" />
            <p v-else-if="tasksError" class="text-negative">{{ tasksError }}</p>

            <q-list v-else bordered separator>
                <q-item v-for="task in tasks" :key="task.id" class="items-center">
                    <q-item-section>
                        <div class="text-weight-medium">{{ task.title }}</div>
                        <div class="text-caption text-grey">
                            {{ t('keywordsLabel') }}
                            <span v-if="task.keywords?.length">
                                {{task.keywords.map(k => k.name).join(', ')}}
                            </span>
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

            <p v-if="!loadingTasks && tasks?.length === 0" class="q-mt-md">{{ t('noTasks') }}</p>
        </q-card>
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