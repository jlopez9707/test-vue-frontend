import { createI18n } from 'vue-i18n'

const messages = {
  es: {
    keywords: 'Palabras clave',
    newKeyword: 'Nueva keyword',
    addKeyword: 'Agregar keyword',
    noKeywords: 'No hay keywords',
    newTask: 'Nueva tarea',
    taskTitle: 'Título de la tarea',
    selectKeywords: 'Selecciona keywords',
    createTask: 'Crear tarea',
    tasks: 'Tareas',
    noTasks: 'No hay tareas',
    completed: 'Completada',
    pending: 'Pendiente',
    keywordsLabel: 'Palabras clave:',
  },
  en: {
    keywords: 'Keywords',
    newKeyword: 'New keyword',
    addKeyword: 'Add keyword',
    noKeywords: 'No keywords',
    newTask: 'New task',
    taskTitle: 'Task title',
    selectKeywords: 'Select keywords',
    createTask: 'Create task',
    tasks: 'Tasks',
    noTasks: 'No tasks',
    completed: 'Completed',
    pending: 'Pending',
    keywordsLabel: 'Keywords:',
  }
}

export const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'en',
  messages
})
