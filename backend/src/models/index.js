const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  logging: false,
});

const db = {
  User: require('./user')(sequelize),
  Venue: require('./venue')(sequelize),
  Post: require('./post')(sequelize),
  Comment: require('./comment')(sequelize),
  Like: require('./like')(sequelize),
  Friendship: require('./friendship')(sequelize),
  VenueCheckin: require('./venueCheckin')(sequelize),
};

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
