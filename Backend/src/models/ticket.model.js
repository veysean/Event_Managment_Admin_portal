import enums from './enums.js';

export default (sequelize, DataTypes) => sequelize.define('Ticket', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'events',
      key: 'eventId'
    }
  },
  ticket_type: {
    type: DataTypes.ENUM(enums.TicketTypeEnum),
    primaryKey: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: false,
  tableName: 'tickets'
});