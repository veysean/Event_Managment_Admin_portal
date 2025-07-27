export default (sequelize, DataTypes) => sequelize.define('Attendee', {
  attendeeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(10),
    validate: {
      isIn: [['male', 'female', 'other']]
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(25)
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    }
  }
}, {
  timestamps: false,
  tableName: 'attendees'
});