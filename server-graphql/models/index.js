const Sequelize = require('sequelize')
const chalk = require('chalk')
const sequelize = new Sequelize('sqlite:./data/main.db')

sequelize
  .authenticate()
  .then(
    () => console.log(chalk.blue('database working correctly')),
    (err) => console.log(chalk.red(`Error: ${err}`))
  )

const User = sequelize.define('User', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  rut: { type: Sequelize.TEXT, unique: true },
  name: { type: Sequelize.TEXT, allowNull: false },
  lastName: { type: Sequelize.TEXT, allowNull: false },
  mail: { type: Sequelize.TEXT, allowNull: false, unique: true }
})

User.sync({ force: true }).then(() => {
  return User.create({
    rut: '199285912',
    name: 'test1',
    lastName: 'test1',
    mail: 'test@test.com'
  })
})

module.exports = User
