import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchBook, fetchBooks, BOOKID_KEY, DEFAULT_PAGINATION_LIMIT } from '@/services/googleBooks'

export const useBookStore = defineStore('book', () => {
  /** Array of downloaded books @type {import('vue').Ref<Book[]>} */
  const books = ref([])
  /** Loading state @type {import('vue').Ref<boolean>} */
  const loading = ref(false)
  /** Error message @type {import('vue').Ref<string|null>} */
  const error = ref(null)
  /** Pagination index position  @type {import('vue').Ref<number>} */
  const position = ref(0)
  /** Selected book @type {import('vue').Ref<Book|null>} */
  const book = ref(null)
  /** State of the book dialog @type {import('vue').Ref<boolean>} */
  const bookDialog = ref(false)
  /** Router instance @type {import('vue').Ref<import('vue-router').Router|null>} */
  const currentRouter = ref(null)
  /** Is additional loading available @type {import('vue').Ref<boolean>} */
  const isAdditionalLoadingAvailable = ref(false)

  /** Set the current router
   * @param {import('vue-router').Router} router
   */
  const setCurrentRouter = (router) => {
    currentRouter.value = router
  }

  /** Clears the error message */
  const clearError = async () => {
    error.value = null
  }

  /**
   * Load books
   * @param {LoadOptions} [options] - Load more books
   */
  const loadBooks = async (options) => {
    const more = options?.more
    loading.value = true
    error.value = null
    if (!more) {
      position.value = 0
    }
    try {
      const result = await fetchBooks({ startIndex: position.value })
      if (result.error) {
        throw new Error(result.error)
      }
      books.value = more ? books.value.concat(result.data) : result.data
      position.value = books.value.length
      isAdditionalLoadingAvailable.value = result.data.length >= DEFAULT_PAGINATION_LIMIT
    } catch (err) {
      error.value = 'Ошибка при загрузке книг'
    } finally {
      loading.value = false
    }
  }

  /** Open book dialog
   * @param {Book} volume - Open book
   */
  const openDialog = (volume) => {
    book.value = { ...volume }
    bookDialog.value = true
    currentRouter.value?.replace({ hash: `#${BOOKID_KEY}=${volume.id}` })
  }

  /** Close book dialog */
  const closeDialog = () => {
    book.value = null
    bookDialog.value = false
    currentRouter.value?.replace({ hash: '' })
  }

  /** Open book dialog
   * @param {string} id - Open book
   */
  const getBookById = async (id) => {
    loading.value = true
    error.value = null
    let result
    try {
      result = await fetchBook(id)
      if (result.error) {
        throw new Error(result.error)
      }
      books.value = [result.data]
      book.value = result.data
      bookDialog.value = true
      isAdditionalLoadingAvailable.value = false
    } catch (err) {
      if (result?.status === 404) {
        error.value = 'Книга не найдена'
      } else if (result?.status === 503) {
        error.value = 'Ошибка при загрузке книги. \nВозможно неверный id'
      } else {
        error.value = 'Ошибка при загрузке книги'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    book,
    books,
    loading,
    error,
    bookDialog,
    isAdditionalLoadingAvailable,
    setCurrentRouter,
    clearError,
    loadBooks,
    openDialog,
    closeDialog,
    getBookById,
  }
})

/**
 * @typedef {Object} LoadOptions
 * @property {boolean} [more] - If you need to load more books
 */

/** @typedef {import('@/types.js').Book} Book */
/** @typedef {import('@/types.js').BookInfo} BookInfo */
