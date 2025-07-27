export default (sequelize, DataTypes) => sequelize.define('Employee', {
  empId: {
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
  DOB: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: true
    }
  },
  gender: {
    type: DataTypes.STRING(10),
    validate: {
      isIn: [['male', 'female', 'other']]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(25),
    unique: true,
    allowNull: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'roleId'
    }
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: false,
  tableName: 'employees'
});