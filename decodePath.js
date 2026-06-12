/**
 * Decodes a URL path by handling percent-encoded characters while preserving forward slashes.
 *
 * Copied from react-router's internal decodePath utility (MIT).
 * Copyright (c) React Training LLC 2015-2019, Remix Software Inc. 2020-2021, Shopify Inc. 2022-2023
 * https://github.com/remix-run/react-router
 *
 * @param {string} value - The URL path to decode
 * @returns {string} The decoded URL path
 *
 * @example
 * decodePath('/products/summer%20collection/t-shirt')
 * // => '/products/summer collection/t-shirt'
 *
 * decodePath('/files/2023%2F01%2Fdocument.pdf')
 * // => '/files/2023%2F01%2Fdocument.pdf'
 *
 * decodePath('/search/%40username%20%26%20title')
 * // => '/search/@username & title'
 */
function decodePath(value) {
  try {
    return value
      .split('/')
      .map((v) => decodeURIComponent(v).replace(/\//g, '%2F'))
      .join('/');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `The URL path "${value}" could not be decoded because it is a `
      + 'malformed URL segment. This is probably due to a bad percent '
      + `encoding (${error}).`
    );
    return value;
  }
}

export default decodePath;
