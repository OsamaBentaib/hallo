const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    createdAt: String!
    token: String
  }
  type Message {
    content: String!
    from: ID!
    to: ID!
    createdAt: String
    seen: Boolean!
    Image: Image
  }
  type conversations {
    user: User!
    latestMessage: [Message]!
    badge: String
  }
  type Image {
    path: String
    filename: String
    mimetype: String
    encoding: String
  }
  type bol {
    is: Boolean
  }
  type Query {
    getUsers(keyword: String!): [User]!
    getConversations: [conversations]
    login(username: String!, password: String!): User!
    getMessages(from: ID!, start: Int!, limit: Int!): [Message]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(
      to: ID!
      content: String!
      createdAt: String!
      Image: Upload
    ): Message!
    setSeen(to: ID!): bol!
    setTyping(to: ID!, typing: Boolean!): bol!
  }
  type Subscription {
    newMessage: Message!
    newConversation: conversations!
    setSeen: bol
    startTyping: bol
    stopedTyping: bol
  }
`;
