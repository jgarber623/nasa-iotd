export default class HTTPResponseError extends Error {
  constructor(response) {
    const { status, statusText, url } = response;

    super(`HTTP Error Response: ${status} ${statusText} <${url}>`);

    this.response = response;
  }
}
