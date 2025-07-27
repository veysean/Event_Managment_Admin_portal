import enums from './enums.js';
export default (sequelize, DataTypes) =>
  sequelize.define('EventType', {
    eventTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.ENUM(enums.EventTypeEnum),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'event_types'
  });