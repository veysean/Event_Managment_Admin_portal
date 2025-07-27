import enums from './enums.js';
export default (sequelize, DataTypes) =>
    sequelize.define('Event', {
        eventId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false }, 
        startDate: { type: DataTypes.DATE, allowNull: false },
        end_date: {
            type: DataTypes.DATE,
            validate: {
            isAfterStartDate(value) {
                if (value <= this.start_date) {
                throw new Error('End date must be after start date');
                }
            }
            }
        },
        desc: { type: DataTypes.TEXT, allowNull: true },
        budget: {
            type: DataTypes.DECIMAL(10, 2),
            validate: {min:0}
        },
        status: {
            type: DataTypes.ENUM(enums.StatusEnum),
            defaultValue: 'pending'
        },
        eventTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'event_types',
            key: 'eventTypeId'
            }
        },
        venueId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'venues',
            key: 'venueId'
            }
        },
        custId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'customers',
            key: 'custId'
            }
        }
    }, {
        timestamps: false,
        tableName: 'events'
    });