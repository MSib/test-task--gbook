<script setup>
import { ref } from 'vue'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useBookStore } from '@/stores/book.js'
import { BOOKID_KEY } from '@/services/googleBooks'
import BooksTable from '@/components/BooksTable.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useBookStore()
const { setCurrentRouter, loadBooks, clearError, getBookById } = store
const { books, loading, error, isAdditionalLoadingAvailable } = storeToRefs(store)

/** State of the page @type {import('vue').Ref<boolean>} */
const isStarted = ref(false)

setCurrentRouter(router)

/**
 * Check bookId. If the ID is present and valid then it will be returned, otherwise an undefined value will be returned
 * @param {string} hash
 * @returns {string|undefined}
 */
const checkBookId = (hash) => {
  if (!hash) {
    return
  }
  const str = hash.substring(1)
  const [key, value] = str.split('=')
  const pattern = /^[A-Za-z0-9\-_]{12}$/
  const isIdValid = pattern.test(value)
  if (key === BOOKID_KEY && isIdValid) {
    return value
  }
  return
}

const startPage = () => {
  let isDefaultLoad = false
  if (route.hash) {
    const bookId = checkBookId(route.hash)
    if (!bookId) {
      isDefaultLoad = true
    } else {
      getBookById(bookId)
    }
  } else {
    if (!books.value.length) {
      isDefaultLoad = true
    }
  }
  if (isDefaultLoad) {
    onLoad()
  }
  isStarted.value = true
}

/** Initial loading of books */
const onLoad = () => {
  if (route.hash) {
    router.replace({ hash: '' })
  }
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

watch(error, async (newError, oldError) => {
  if (newError) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: newError, life: 3000 })
  }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div v-if="isStarted && !books.length" class="flex justify-center last-of-type:mb-5">
      <Button label="Загрузить книги" @click="onLoad" :loading="loading" class="px-12" />
    </div>
    <div v-if="(isStarted && !loading && books.length) || isAdditionalLoadingAvailable">
      <BooksTable />
    </div>
    <div v-if="isStarted && books.length && isAdditionalLoadingAvailable" class="flex justify-center last-of-type:mb-5">
      <Button label="Загрузить ещё" @click="onLoadMore" :loading="loading" class="px-12" />
    </div>
    <Toast @close="onCloseError" @life-end="onCloseError" />
  </div>
</template>

<style scoped></style>
