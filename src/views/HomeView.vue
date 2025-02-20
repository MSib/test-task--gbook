<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useBookStore } from '@/stores/book.js'
import { BOOKID_KEY } from '@/services/googleBooks'
import SearchPanel from '@/components/SearchPanel.vue'
import BooksTable from '@/components/BooksTable.vue'

const route = useRoute()
const toast = useToast()
const store = useBookStore()
const { loadBooks, clearError, getBookById } = store
const { books, loading, error, isAdditionalLoadingAvailable } = storeToRefs(store)

/**
 * Check bookId. If the ID is present and valid then it will be returned, otherwise an undefined value will be returned
 * @param {string|undefined} id - The book id
 * @returns {string|undefined}
 * @example
 */
const matchBookId = (id) => {
  if (!id) {
    return
  }
  const pattern = /^[A-Za-z0-9\-_]{12}$/
  const isMatch = pattern.test(id)
  if (isMatch) {
    return id
  }
  return
}

/** Checking the route query */
const startPage = () => {
  const query = Object.keys(route.query).length ? route.query : null
  if (query) {
    const bookId = matchBookId(Array.isArray(query[BOOKID_KEY]) ? query[BOOKID_KEY][0] : query[BOOKID_KEY])
    if (bookId) {
      getBookById(bookId)
      return
    }
  }
  if (!books.value.length) {
    onLoad()
  }
}

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
  startPage()
})

watch(error, async (newError) => {
  if (newError) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: newError, life: 3000 })
  }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <SearchPanel />
    </div>
    <div v-if="(!loading && books.length) || isAdditionalLoadingAvailable">
      <BooksTable />
    </div>
    <div v-if="loading && !books.length" class="card flex justify-center">
      <ProgressSpinner />
    </div>
    <div v-if="!loading && !books.length" class="flex justify-center text-2xl">
      <p>Список пуст</p>
    </div>
    <div v-if="books.length && isAdditionalLoadingAvailable" class="flex justify-center last-of-type:mb-5">
      <Button label="Загрузить ещё" @click="onLoadMore" :loading="loading" severity="secondary" class="px-12" />
    </div>
    <Toast @close="onCloseError" @life-end="onCloseError" />
  </div>
</template>

<style scoped></style>
