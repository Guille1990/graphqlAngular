const User = require('../models')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const USER_ADDED_TOPIC = 'newUser'
const USER_UPDATED_TOPIC = 'updateUser'

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
      user.update(args.user).then(res => {
        pubsub.publish(USER_UPDATED_TOPIC, { userUpdated: res.dataValues })
        return res.dataValues
      })
    })
  },
  Subscription: {
    userAdded: {
      subscribe: () => {
        console.log('Entre al evento userAdded')
        return pubsub.asyncIterator(USER_ADDED_TOPIC) 
      }
    },
    userUpdated: {
      subscribe: () => {
        console.log('Entre al evento userAdded')
        return pubsub.asyncIterator(USER_UPDATED_TOPIC) 
      }
    }
  }
}

module.exports = resolvers
