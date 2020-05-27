const { ApolloServer } = require("apollo-server");
// TODO: https://stackoverflow.com/questions/28007530/loading-a-specific-file-from-a-module-in-node
const { importSchema } = require("graphql-import");
const typeDefs = importSchema("../shared/schema.graphql");
// const typeDefs = fs.readFileSync(path.join(__dirname, "shared/schema.graphql", "utf8");

const books = [
  {
    id: "1",
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    id: "2",
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args) => books.find(book => book.id === args.id)
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
