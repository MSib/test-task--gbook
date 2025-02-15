/** Google Books API @type {string}  */
const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'
/** Bookid key in hash @type {string} */
export const BOOKID_KEY = 'bookId'

/** The default number of results to return @type {number} */
export const DEFAULT_PAGINATION_LIMIT = 10

/**
 * Fetches books from the Google Books API
 * @param {BooksOptions} [options] - The search options
 * @returns {Promise<ResponseBooks>} - The search results
 */
export const fetchBooks = async (options) => {
  /** The status code @type {number} */
  let status = 200
  const BROAD_GENRE = 'subject:General'
  const startIndex = options?.startIndex
  const params = new URLSearchParams()
  params.append('q', BROAD_GENRE)
  if (startIndex) {
    params.append('startIndex', (startIndex < 0 ? 0 : startIndex).toString())
  }
  try {
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`)
    status = response.status
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }
    /** @type {Books}  */
    const data = await response.json()
    return { data: data.items || [], status }
  } catch (error) {
    console.error('Ошибка при получении данных из Google Books API:', error)
    return { data: [], status, error: 'Ошибка при получении списка книг' }
  }
}

/**
 * Fetches book by id from the Google Books API
 * @param {string} id - The book id
 * @returns {Promise<ResponseBook>} - The search result
 */
export const fetchBook = async (id) => {
  /** The status code @type {number} */
  let status = 200
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    status = response.status
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }
    /** @type {Book}  */
    const data = await response.json()
    return { data, status }
  } catch (error) {
    console.error('Ошибка при получении данных из Google Books API:', error)
    return { error: 'Ошибка при получении книги.', status }
  }
}

/** @typedef {import('@/types.js').BooksOptions} BooksOptions */
/** @typedef {import('@/types.js').ResponseBooks} ResponseBooks */
/** @typedef {import('@/types.js').ResponseBook} ResponseBook */
/** @typedef {import('@/types.js').Books} Books */
/** @typedef {import('@/types.js').Book} Book */
