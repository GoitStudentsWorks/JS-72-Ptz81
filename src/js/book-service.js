import axios from 'axios';
import Loader from './loader/loader';

const loader = new Loader();

const LOADER_DELAY = 0;
let instance;

export default class BookService {
  static BASE_URL = 'https://books-backend.p.goit.global/books';

  constructor() {
    if (instance) return instance;

    this.showLoader = true;

    instance = this;
  }

  async #fetchBooks(res, params) {
    try {
      const p = Object.entries(params || '')
        ?.map(([name, value]) => `${name}=${value}`)
        .join('&');

      const url = encodeURI(
        `${BookService.BASE_URL}/${res}${p ? `/?${p}` : ''}`
      );

      // показываем лоадер
      if (this.showLoader) loader.show({ delay: LOADER_DELAY });

      const { data } = await axios.get(url);
      return data;

      // error
    } catch (axiosError) {
      const error = new Error(axiosError.message);

      error.name = axiosError.name;
      error.code = axiosError.code;
      error.response = {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
      };

      throw error;
    } finally {
      loader.hide();
    }
  }

  async getCategoryList() {
    return await this.#fetchBooks(`category-list`);
  }

  async getTopBooks() {
    return await this.#fetchBooks(`top-books`);
  }

  async getBooksByCategory(category) {
    return await this.#fetchBooks(`category`, { category });
  }

  async getBooksById(bookId) {
    return await this.#fetchBooks(bookId);
  }
}
