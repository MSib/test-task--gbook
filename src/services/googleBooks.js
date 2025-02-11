/** Google Books API @type {string}  */
const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

/**
 * Fetches books from the Google Books API
 * @param {RequestOptions} [options] - The search options
 * @returns {Promise<ResponseOptions>} - The search results
 */
export const fetchBooks = async (options) => {
  const BROAD_GENRE = 'subject:General'
  const startIndex = options?.startIndex
  const params = new URLSearchParams()
  params.append('q', BROAD_GENRE)
  if (startIndex) {
    params.append('startIndex', (startIndex < 0 ? 0 : startIndex).toString())
  }
  try {
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }
    /** @type {Books}  */
    const data = await response.json()
    return { data: data.items || [] }
  } catch (error) {
    console.error('Ошибка при получении данных из Google Books API:', error)
    return { data: [], error: 'Ошибка при получении данных из Google Books API' }
  }
}

/** @typedef {import('@/types.js').RequestOptions} RequestOptions */
/** @typedef {import('@/types.js').ResponseOptions} ResponseOptions */
/** @typedef {import('@/types.js').Books} Books */
