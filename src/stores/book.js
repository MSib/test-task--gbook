import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchBooks } from '@/services/googleBooks'

export const useBookStore = defineStore('book', () => {
  /** Array of downloaded books @type {import('vue').Ref<Book[]>} */
  const books = ref([])
  /** Loading state @type {import('vue').Ref<boolean>} */
  const loading = ref(false)
  /** Error message @type {import('vue').Ref<string|null>} */
  const error = ref(null)
  /** Pagination index position  @type {import('vue').Ref<number>} */
  const position = ref(0)

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
    } catch (err) {
      error.value = 'Ошибка при загрузке книг'
    } finally {
      loading.value = false
    }
  }

  return { books, loading, error, clearError, loadBooks }
})

/**
 * @typedef {Object} LoadOptions
 * @property {boolean} [more] - If you need to load more books
 */

/** @typedef {import('@/types.js').Book} Book */
/** @typedef {import('@/types.js').BookInfo} BookInfo */
