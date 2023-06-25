const Book = require("../models/Book");
const User = require("../models/User");
const { ApolloError } = require("apollo-server-errors");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

module.exports = {
  Query: {
    getHardcoverFictionRecommendations: async (_, __, { dataSources }) => {
      return dataSources.nyTimesBooksAPI.getHardcoverFictionRecommendations();
    },
    getHardcoverNonFictionRecommendations: async (_, __, { dataSources }) => {
      return dataSources.nyTimesBooksAPI.getHardcoverNonFictionRecommendations();
    },
    getPaperbackFictionRecommendations: async (_, __, { dataSources }) => {
      return dataSources.nyTimesBooksAPI.getPaperbackFictionRecommendations();
    },
    getPaperbackNonFictionRecommendations: async (_, __, { dataSources }) => {
      return dataSources.nyTimesBooksAPI.getPaperbackNonFictionRecommendations();
    },
    getGoogleBooksSearch: async (_, { query, page }, { dataSources }) => {
      return dataSources.googleBooksAPI.getGoogleBooksSearch(query, page);
    },
    getBooks: async (_, { userId }) => await Book.find({ userId }),
  },
  Mutation: {
    registerUser: async (_, { registerInput: { username, password } }) => {
      const oldUser = await User.findOne({ username });

      if (oldUser) {
        throw new ApolloError(
          `A user is already registered with username ${username}. Please choose a different username.`,
          "USER_ALREADY_EXISTS"
        );
      }

      if (username === "" || username === null || username === undefined) {
        throw new ApolloError("Username must not be empty", "EMPTY_USERNAME");
      }

      if (password === "" || password === null || password === undefined) {
        throw new ApolloError("Password must not be empty", "EMPTY_PASSWORD");
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: encryptedPassword,
      });

      const savedUser = await newUser.save();

      const token = generateToken(savedUser);

      return {
        id: savedUser.id,
        ...savedUser._doc,
        token,
      };
    },
    loginUser: async (_, { loginInput: { username, password } }) => {
      if (username === "" || username === null || username === undefined) {
        throw new ApolloError("Username must not be empty", "EMPTY_USERNAME");
      }

      if (password === "" || password === null || password === undefined) {
        throw new ApolloError("Password must not be empty", "EMPTY_PASSWORD");
      }

      const user = await User.findOne({ username });

      if (!user) {
        throw new ApolloError(`User ${username} not found`, "USER_NOT_FOUND");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }

      const token = generateToken(user);

      return {
        id: user._id,
        ...user._doc,
        token,
      };
    },
    addBook: async (_, { bookInput: { title, author, userId } }) => {
      if (!userId) {
        throw new ApolloError(
          "A valid UserId was not provided",
          "PROVIDE_VALID_USERID"
        );
      }

      if (title === "" || title === null || title === undefined) {
        throw new ApolloError("Title must not be empty", "EMPTY_TITLE");
      }

      if (author === "" || author === null || author === undefined) {
        throw new ApolloError("Author must not be empty", "EMPTY_AUTHOR");
      }

      const book = new Book({
        title,
        author,
        userId,
      });

      await book.save();

      return book;
    },
    deleteBook: async (_, { id }) => {
      const deletedBook = await Book.deleteOne({ _id: id });
      if (deletedBook.acknowledged && deletedBook.deletedCount === 1) {
        return id;
      }
      return null;
    },
    updateBook: async (_, { id, title, author }) => {
      if (title === "" || title === null || title === undefined) {
        throw new ApolloError("Title must not be empty", "EMPTY_TITLE");
      }

      if (author === "" || author === null || author === undefined) {
        throw new ApolloError("Author must not be empty", "EMPTY_AUTHOR");
      }

      const updatedBook = await Book.updateOne(
        { _id: id },
        {
          $set: {
            title,
            author,
          },
        }
      );

      if (updatedBook.acknowledged && updatedBook.modifiedCount === 1) {
        return await Book.findOne({ _id: id });
      }
      return null;
    },
  },
};
