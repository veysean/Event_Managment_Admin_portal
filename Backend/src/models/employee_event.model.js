export default (sequelize, DataTypes) => sequelize.define('EmployeeEvent', {
  empId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'employees',
      key: 'empId'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'events',
      key: 'eventId'
    }
  }
}, {
  timestamps: false,
  tableName: 'employee_events'
});