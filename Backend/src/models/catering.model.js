export default (sequelize, DataTypes) => sequelize.define('Catering', {
  cateringId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  catering_set: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: false,
  tableName: 'caterings'
});