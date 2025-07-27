export default (sequelize, DataTypes) => sequelize.define('EventCatering', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'events',
      key: 'eventId'
    }
  },
  cateringId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'caterings',
      key: 'cateringId'
    }
  },
  num_of_set: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  timestamps: false,
  tableName: 'event_catering'
});