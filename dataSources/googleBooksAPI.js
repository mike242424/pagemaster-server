const { RESTDataSource } = require("@apollo/datasource-rest");

class GoogleBooksAPI extends RESTDataSource {
  baseURL = "https://www.googleapis.com/";

  async getGoogleBooksSearch(query, page) {
    const maxResultsPerPage = 15;
    const startIndex = (page - 1) * maxResultsPerPage;
    // console.log(startIndex);

    const url = `books/v1/volumes?q=${query}&maxResults=${maxResultsPerPage}&startIndex=${startIndex}`;
    console.log(url);

    return this.get(url);
  }
}

module.exports = GoogleBooksAPI;
