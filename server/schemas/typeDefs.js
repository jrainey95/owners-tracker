const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String
    savedHorses: [Horse]
  }

  type Horse {
    horseId: ID!
    horseName: String!
    age: Int!
    gender: String!
    sire: String
    dam: String
    trainer: String
    country: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input HorseInput {
    horseName: String!
    age: Int!
    gender: String!
    sire: String
    dam: String
    trainer: String
    country: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveHorse(HorseData: HorseInput!): User
    
    removeHorse(HorseId: ID!): User
  }
`;

module.exports = typeDefs;
