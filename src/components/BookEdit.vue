<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book.js'

const store = useBookStore()
const { editBook, closeDialogEdit } = store
const { editableBook, bookDialogEdit } = storeToRefs(store)

/** Title of the book being edited @type {import('vue').Ref<string>} */
const title = ref(editableBook.value?.volumeInfo.title || '')
/** Title validation error @type {import('vue').Ref<string>} */
const titleError = ref('')
/** State of the book dialog @type {import('vue').Ref<boolean>} */
const dialog = ref(bookDialogEdit.value ?? false)
/** Maximum length of the title @type {number} */
const TITLE_MAX_LENGTH = 250

/** Save edited book */
const edit = () => {
  validateTitle()
  if (!titleError.value) {
    if (title.value !== editableBook.value.volumeInfo.title) {
      const book = { ...editableBook.value }
      book.volumeInfo.title = title.value
      editBook(book)
    } else {
      closeDialogEdit()
    }
  }
}

/** Close edit dialog */
const hideDialog = () => {
  dialog.value = false
}

/** Validates the book title */
const validateTitle = () => {
  titleError.value = ''
  if (!title.value) {
    titleError.value = 'Введите название книги'
    return
  }
  if (title.value.length > TITLE_MAX_LENGTH) {
    titleError.value = 'Cлишком длинное название'
  }
}

watch(dialog, (value) => {
  if (!value) {
    closeDialogEdit()
  }
})

watch(bookDialogEdit, () => {
  dialog.value = bookDialogEdit.value
  if (bookDialogEdit.value) {
    title.value = editableBook.value?.volumeInfo.title
    titleError.value = ''
  }
})
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialog" modal header="Редактирование информации о книге" :style="{ width: '30rem' }">
      <div>
        <div class="flex items-center gap-4 mb-4">
          <label for="username" class="font-semibold w-24">Название</label>
          <InputText
            v-model:model-value="title"
            :invalid="!!titleError"
            @input="validateTitle"
            @keypress.enter="edit"
            id="username"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <Message size="small" severity="error" variant="simple" class="mb-4">{{ titleError }}</Message>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Сохранить" @click="edit" :disabled="!!titleError"></Button>
        <Button type="button" label="Отменить" severity="secondary" @click="hideDialog"></Button>
      </div>
    </Dialog>
  </div>
</template>
