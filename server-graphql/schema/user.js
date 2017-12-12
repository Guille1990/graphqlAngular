module.exports = `
  type User {
    id: ID!
    rut: String!
    name: String!
    lastName: String!
    mail: String!
  }

  input updateUser {
    name: String!
    lastName: String!
    mail: String!
  }

  input newUser {
    rut: String!
    name: String!
    lastName: String!
    mail: String!
  }
`
