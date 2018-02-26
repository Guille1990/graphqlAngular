const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('../resolvers/user')

const user = require('./user')

const rootQuerys = `
  type Query {
    user(id: Int): User
    users: [User]
  }

  type Mutation {
    userAdd(user: newUser): User
    userUpdate(id: Int!, user: updateUser): User
    userDelete(id: Int!): User
  }

  type Subscription {
    userAdded: User
    userUpdated: User
    userDeleted: User
  }
`

const schema = makeExecutableSchema({
  typeDefs: [ rootQuerys, user ],
  resolvers
})

module.exports = schema
