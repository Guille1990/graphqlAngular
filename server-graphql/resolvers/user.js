const User = require('../models')
const { PubSub } = require('graphql-subscriptions')
const chalk = require('chalk')

const pubsub = new PubSub()
const USER_ADDED_TOPIC = 'newUser'
const USER_UPDATED_TOPIC = 'updateUser'
const USER_DELETED_TOPIC = 'deleteUser'

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
    }),
    userDelete: (_, args) => User.findById(args.id).then(async user => {
      await user.destroy()
      pubsub.publish(USER_DELETED_TOPIC, { userDeleted: user })
      return user
    })
  },
  Subscription: {
    userAdded: {
      subscribe: () => {
        console.log(chalk.green('Subscription userAdded'))
        return pubsub.asyncIterator(USER_ADDED_TOPIC)
      }
    },
    userUpdated: {
      subscribe: () => {
        console.log(chalk.yellow('Subscription userUpdated'))
        return pubsub.asyncIterator(USER_UPDATED_TOPIC)
      }
    },
    userDeleted: {
      subscribe: () => {
        console.log(chalk.red('Subscription userDeleted'))
        return pubsub.asyncIterator(USER_DELETED_TOPIC)
      }
    }
  }
}

module.exports = resolvers
