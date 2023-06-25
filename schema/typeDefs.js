const { gql } = require("graphql-tag");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    token: String!
  }

  input RegisterInput {
    username: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    userId: ID!
  }

  input BookInput {
    title: String!
    author: String!
    userId: ID!
  }

  type Recommendation {
    results: Result
  }

  type Result {
    books: [NYTimesBook]
  }

  type NYTimesBook {
    rank: Int
    title: String
    author: String
    description: String
    book_image: String
  }

  type GoogleBooks {
    totalItems: Int
    items: [GoogleBook]
  }

  type GoogleBook {
    id: ID
    volumeInfo: VolumeInfo
  }

  type VolumeInfo {
    title: String
    description: String
    authors: [String]
    imageLinks: Image
  }

  type Image {
    thumbnail: String
  }

  type Query {
    getBooks(userId: ID!): [Book]
    getHardcoverFictionRecommendations: Recommendation
    getHardcoverNonFictionRecommendations: Recommendation
    getPaperbackFictionRecommendations: Recommendation
    getPaperbackNonFictionRecommendations: Recommendation
    getGoogleBooksSearch(query: String!, page: Int!): GoogleBooks
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
    addBook(bookInput: BookInput): Book!
    deleteBook(id: ID): ID
    updateBook(id: ID!, title: String!, author: String!): Book
  }
`;
