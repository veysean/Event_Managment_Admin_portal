import enums from './enums.js';

export default (sequelize, DataTypes) => sequelize.define('Role', {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dept_name: {
    type: DataTypes.ENUM(enums.DeptListEnum),
    allowNull: false
  },
  min_salary: {
    type: DataTypes.DECIMAL(10, 2)
  },
  max_salary: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  timestamps: false,
  tableName: 'roles'
});