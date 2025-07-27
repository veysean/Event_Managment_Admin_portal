export default (sequelize, DataTypes) =>
    sequelize.define('Venues', {
        venueId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        location: { type: DataTypes.STRING(255), allowNull: false },
        max_occupancy: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
        email: { type: DataTypes.STRING(255), unique: true, validate: { isEmail: true } },
        phone: { type: DataTypes.STRING(25), allowNull: false },
    }, {
        timestamps: false,
        tableName: 'venues'
    });