const { RESTDataSource } = require("@apollo/datasource-rest");

class NYTimesBooksAPI extends RESTDataSource {
  baseURL = "https://api.nytimes.com/svc/";

  async getHardcoverFictionRecommendations() {
    const url = `books/v3/lists/current/hardcover-fiction.json?api-key=${process.env.NEW_YORK_TIMES_API_KEY}`;

    return this.get(url);
  }

  async getHardcoverNonFictionRecommendations() {
    const url = `books/v3/lists/current/hardcover-nonfiction.json?api-key=${process.env.NEW_YORK_TIMES_API_KEY}`;

    return this.get(url);
  }

  async getPaperbackFictionRecommendations() {
    const url = `books/v3/lists/current/trade-fiction-paperback.json?api-key=${process.env.NEW_YORK_TIMES_API_KEY}`;

    return this.get(url);
  }

  async getPaperbackNonFictionRecommendations() {
    const url = `books/v3/lists/current/paperback-nonfiction.json?api-key=${process.env.NEW_YORK_TIMES_API_KEY}`;

    return this.get(url);
  }
}

module.exports = NYTimesBooksAPI;
