import enums from './enums.js';

export default (sequelize, DataTypes) => sequelize.define('SoldTicket', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'eventId'
    }
  },
  attendeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'attendees',
      key: 'attendeeId'
    }
  },
  ticket_type: {
    type: DataTypes.ENUM(enums.TicketTypeEnum),
    allowNull: false
  },
  purchase_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  payment_method: {
    type: DataTypes.ENUM(enums.PaymentMethodEnum)
  }
}, {
  timestamps: false,
  tableName: 'sold_tickets'
});