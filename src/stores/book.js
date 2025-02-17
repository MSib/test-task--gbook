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
  /** State of the book dialog detail @type {import('vue').Ref<boolean>} */
  const bookDialogDetail = ref(false)
  /** Editable book @type {import('vue').Ref<Book|null>} */
  const editableBook = ref(null)
  /** State of the book dialog edit @type {import('vue').Ref<boolean>} */
  const bookDialogEdit = ref(false)
  /** Current route instance @type {import('vue').Ref<import('vue-router').RouteLocationNormalized|null>} */
  const currentRoute = ref(null)
  /** Router instance @type {import('vue').Ref<import('vue-router').Router|null>} */
  const currentRouter = ref(null)
  /** Is additional loading available @type {import('vue').Ref<boolean>} */
  const isAdditionalLoadingAvailable = ref(false)
  /** Last search params @type {import('vue').Ref<LastSearchParams>} */
  const lastSearchParams = ref({})

  /** Set the current router
   * @param {import('vue-router').RouteLocationNormalized} route
   */
  const setCurrentRoute = (route) => {
    currentRoute.value = route
  }

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
    const query = options?.query
    const more = options?.more
    if (query) {
      lastSearchParams.value = { query }
    }
    loading.value = true
    error.value = null
    if (!more) {
      position.value = 0
    }
    let result
    try {
      result = await fetchBooks({ query: query || lastSearchParams.value?.query, startIndex: position.value })
      if (result.error) {
        throw new Error(result.error)
      }
      books.value = more ? books.value.concat(result.data) : result.data
      position.value = books.value.length
      isAdditionalLoadingAvailable.value = result.data.length >= DEFAULT_PAGINATION_LIMIT
    } catch (err) {
      if (result?.status === 429) {
        error.value = 'Превышен лимит запросов к серверу'
      } else {
        error.value = 'Ошибка при загрузке книг'
      }
    } finally {
      loading.value = false
    }
  }

  /** Open book dialog
   * @param {Book} volume - Opening book
   */
  const openDialogDetail = (volume) => {
    book.value = { ...volume }
    bookDialogDetail.value = true
    currentRouter.value?.push({ query: { [BOOKID_KEY]: volume.id } })
  }

  /** Close book dialog */
  const closeDialogDetail = () => {
    book.value = null
    bookDialogDetail.value = false
    currentRouter.value?.push({ query: {} })
  }

  /** Open book dialog
   * @param {Book} volume - Opening book
   */
  const openDialogEdit = (volume) => {
    editableBook.value = { ...volume }
    bookDialogEdit.value = true
  }

  /** Edit book and close dialog
   * @param {Book} volume - Opening book
   */
  const editBook = (volume) => {
    const index = books.value.findIndex((book) => book.etag === editableBook.value.etag)
    books.value[index] = { ...volume }
    closeDialogEdit()
  }

  /** Close book dialog */
  const closeDialogEdit = () => {
    bookDialogEdit.value = false
    editableBook.value = null
  }

  /** Get book by id
   * @param {string} id - Book id
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
      bookDialogDetail.value = true
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
    editableBook,
    loading,
    error,
    bookDialogDetail,
    bookDialogEdit,
    isAdditionalLoadingAvailable,
    lastSearchParams,
    setCurrentRoute,
    setCurrentRouter,
    clearError,
    loadBooks,
    openDialogDetail,
    closeDialogDetail,
    getBookById,
    openDialogEdit,
    editBook,
    closeDialogEdit,
  }
})

/**
 * @typedef {Object} LastSearchParams
 * @property {string} [query] - Search query
 */

/**
 * @typedef {Object} LoadOptions
 * @property {string} [query] - Search query
 * @property {boolean} [more] - If you need to load more books
 */

/** @typedef {import('@/types.js').Book} Book */
/** @typedef {import('@/types.js').BookInfo} BookInfo */
