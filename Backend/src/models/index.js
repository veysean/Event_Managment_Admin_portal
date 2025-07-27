import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config.js';
import VenueModel from './venue.model.js';
import CateringModel from './catering.model.js';
import EmployeeModel from './employee.model.js';
import EventModel from './event.model.js';
import UserModel from './user.model.js';
import TicketModel from './ticket.model.js';
import SoldTicketModel from './sold_ticket.model.js';
import RoleModel from './role.model.js';
import EventTypeModel from './event_type.model.js';
import EventPaymentModel from './event_payment.model.js';
import EventCateringModel from './event_catering.model.js';
import EmployeeEventModel from './employee_event.model.js';
import CustomerModel from './customer.model.js';
import AttendeeModel from './attendee.model.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: process.env.NODE_ENV === 'development' ? console.log : false 
});

const db = {
    Sequelize,
    sequelize,
    // Initialize all models
    Venue: VenueModel(sequelize, Sequelize),
    Catering: CateringModel(sequelize, Sequelize),
    Employee: EmployeeModel(sequelize, Sequelize),
    Event: EventModel(sequelize, Sequelize),
    User: UserModel(sequelize, Sequelize),
    Ticket: TicketModel(sequelize, Sequelize),
    SoldTicket: SoldTicketModel(sequelize, Sequelize),
    Role: RoleModel(sequelize, Sequelize),
    EventType: EventTypeModel(sequelize, Sequelize),
    EventPayment: EventPaymentModel(sequelize, Sequelize),
    EventCatering: EventCateringModel(sequelize, Sequelize),
    EmployeeEvent: EmployeeEventModel(sequelize, Sequelize),
    Customer: CustomerModel(sequelize, Sequelize), 
    Attendee: AttendeeModel(sequelize, Sequelize)
};

// Define associations
db.User.hasOne(db.Customer, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Customer.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.Attendee, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Attendee.belongsTo(db.User, { foreignKey: 'userId' });

db.Event.belongsTo(db.EventType, { foreignKey: 'eventTypeId' });
db.EventType.hasMany(db.Event, { foreignKey: 'eventTypeId' });

db.Event.belongsTo(db.Venue, { foreignKey: 'venueId' });
db.Venue.hasMany(db.Event, { foreignKey: 'venueId' });

db.Event.belongsTo(db.Customer, { foreignKey: 'custId' });
db.Customer.hasMany(db.Event, { foreignKey: 'custId' });

db.Event.hasMany(db.Ticket, { foreignKey: 'eventId' });
db.Ticket.belongsTo(db.Event, { foreignKey: 'eventId' });

db.Event.hasMany(db.SoldTicket, { foreignKey: 'eventId' });
db.SoldTicket.belongsTo(db.Event, { foreignKey: 'eventId' });

db.Attendee.hasMany(db.SoldTicket, { foreignKey: 'attendeeId' });
db.SoldTicket.belongsTo(db.Attendee, { foreignKey: 'attendeeId' });

db.Event.belongsToMany(db.Catering, { 
    through: db.EventCatering, 
    foreignKey: 'eventId',
    otherKey: 'cateringId'
});

db.Catering.belongsToMany(db.Event, { 
    through: db.EventCatering,
    foreignKey: 'cateringId',
    otherKey: 'eventId'
});

db.Employee.belongsTo(db.Role, { foreignKey: 'roleId' });
db.Role.hasMany(db.Employee, { foreignKey: 'roleId' });

db.Employee.belongsToMany(db.Event, { 
    through: db.EmployeeEvent,
    foreignKey: 'empId',
    otherKey: 'eventId'
});

db.Event.belongsToMany(db.Employee, { 
    through: db.EmployeeEvent,
    foreignKey: 'eventId',
    otherKey: 'empId'
});

db.Event.hasMany(db.EventPayment, { foreignKey: 'eventId' });
db.EventPayment.belongsTo(db.Event, { foreignKey: 'eventId' });

// Sync only in development
if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
}

export default db;