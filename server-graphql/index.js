const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const chalk = require('chalk')
const schema = require('./schema')
const cors = require('cors')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')

const PORT = process.env.PORT || 1234

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/graphql', graphqlExpress({
  schema,
  formatError: (error) => {
    console.log(error)
    return {
      message: error.message,
      name: error.name
    }
  }
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

const server = createServer(app)

server.listen(PORT, () => {
  console.log(chalk.blue(`App listening in port ${PORT}`))

  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: server,
    path: '/subscriptions'
  })
})
