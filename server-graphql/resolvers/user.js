const User = require('../models')

const resolvers = {
  Query: {
    user: (_, args) => User.findById(args.id),
    users: () => User.findAll().then()
  },
  Mutation: {
    userAdd: (_, args) => User.create(args.user).then(res => {
      return res.dataValues
    }),
    userUpdate: (_, args) => User.findById(args.id).then(user => {
      return user.update(args.user)
    })
  }
}

module.exports = resolvers
