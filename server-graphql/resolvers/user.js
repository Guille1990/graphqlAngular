const User = require('../models')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const USER_ADDED_TOPIC = 'newUser'

const resolvers = {
  Query: {
    user: (_, args) => User.findById(args.id),
    users: () => User.findAll().then()
  },
  Mutation: {
    userAdd: (_, args) => User.create(args.user).then(res => {
      pubsub.publish(USER_ADDED_TOPIC, { userAdded: res.dataValues })
      return res.dataValues
    }),
    userUpdate: (_, args) => User.findById(args.id).then(user => {
      return user.update(args.user)
    })
  },
  Subscription: {
    userAdded: () => pubsub.asyncIterator(USER_ADDED_TOPIC)
  }
}

module.exports = resolvers
