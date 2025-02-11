<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useBookStore } from '@/stores/book.js'
import BooksTable from '@/components/BooksTable.vue'

const toast = useToast()
const store = useBookStore()
const { loadBooks, clearError } = store
const { books, loading, error } = storeToRefs(store)

/** Initial loading of books */
const onLoad = () => {
  loadBooks()
}

/** Load more books */
const onLoadMore = () => {
  loadBooks({ more: true })
}

/** Clear error message */
const onCloseError = () => {
  clearError()
}

onMounted(() => {
  if (!books.value.length) {
    onLoad()
  }
})

watch(error, async (newError, oldError) => {
  if (newError) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: newError, life: 3000 })
  }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <BooksTable />
    <div class="flex justify-center last-of-type:mb-5">
      <Button label="Загрузить ещё" @click="onLoadMore" :loading="loading" class="px-12" />
    </div>
    <Toast @close="onCloseError" @life-end="onCloseError" />
  </div>
</template>

<style scoped></style>
