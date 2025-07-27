import enums from './enums.js';
import bcrypt from 'bcryptjs';


export default (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        userId: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        username: { 
            type: DataTypes.STRING(100), 
            allowNull: false, 
            unique: true 
        },   
        password: { 
            type: DataTypes.STRING(255), 
            allowNull: false 
        },
        email: { 
            type: DataTypes.STRING(255), 
            allowNull: false, 
            unique: true,
            validate: { isEmail: true }
        },
        role: {
            type: DataTypes.ENUM(enums.RoleEnum),
            allowNull: false,
            defaultValue: 'customer'
        }
    }, {
        timestamps: false,
        tableName: 'users'
    });

    // Hash password before create
    User.beforeCreate(async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    // Hash password before update if changed
    User.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    // Instance method to compare passwords
    User.prototype.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    return User;
};