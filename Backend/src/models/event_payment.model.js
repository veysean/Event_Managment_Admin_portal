import enums from './enums.js';

export default (sequelize, DataTypes) => sequelize.define('EventPayment', {
  eventPaymentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  payment_method: {
    type: DataTypes.ENUM(enums.PaymentMethodEnum)
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'events',
      key: 'eventId'
    }
  }
}, {
  timestamps: false,
  tableName: 'event_payments'
});