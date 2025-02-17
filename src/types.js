export {}

/**
 * @typedef {Object} BooksOptions
 * @property {string} [query] - The search query
 * @property {number} [startIndex] - The index of the first result to return
 */

/**
 * @typedef {Object} ResponseBooks
 * @property {Book[]} data
 * @property {number} status
 * @property {string} [error]
 */

/**
 * @typedef {Object} ResponseBook
 * @property {Book} [data]
 * @property {number} status
 * @property {string} [error]
 */

/**
 * @typedef {Object} BookInfo
 * @property {string} [title]
 * @property {string[]} [authors]
 * @property {string} [publishedDate]
 * @property {string[]} [categories]
 * @property {string} [description]
 * @property {Record<string, any>} [extra]
 */

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} etag
 * @property {string} selfLink
 * @property {BookInfo} volumeInfo
 * @property {Record<string, any>} [extra]
 */

/**
 * @typedef {Object} Books
 * @property {number} totalItems
 * @property {Book[]} [items]
 * @property {Record<string, any>} [extra]
 */
