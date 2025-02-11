export {}

/**
 * @typedef {Object} RequestOptions
 * @property {number} [startIndex] - The index of the first result to return
 */

/**
 * @typedef {Object} ResponseOptions
 * @property {Book[]} data
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
