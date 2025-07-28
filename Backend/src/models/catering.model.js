export default (sequelize, DataTypes) => sequelize.define('Catering', {
  cateringId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cateringSet: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }, 
  imageUrl: {
    type: DataTypes.STRING(512),
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'caterings'
});