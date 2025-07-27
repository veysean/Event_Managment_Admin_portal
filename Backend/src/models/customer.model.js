export default (sequelize, DataTypes) =>
  sequelize.define('Customer', {
    custId: {
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
    organizationName: {
      type: DataTypes.STRING(255)
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
    tableName: 'customers'
  });