import { faker } from '@faker-js/faker';
import db from './models/index.js';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const NUM_USERS = 50;
const NUM_CUSTOMERS = 30;
const NUM_ATTENDEES = 40;
const NUM_EVENTS = 20;
const NUM_EMPLOYEES = 25;
const NUM_CATERINGS = 10;
const NUM_VENUES = 10;
const EVENT_TYPES = ['Conference', 'Workshop', 'Seminar', 'Concert', 'Festival'];
const DEPT_LIST = ['Event management', 'Event operation', 'Marketing', 'IT', 'Finance'];

async function seed() {
    try {
        console.log('Syncing database...');
        await db.sequelize.sync({ force: true });
        console.log('Database synced.');

        // Create Users
        console.log('Creating users...');
        const users = await db.User.bulkCreate(
            Array.from({ length: NUM_USERS }, (_, i) => ({
                username: faker.internet.userName() + i,
                password: faker.internet.password(),
                email: faker.internet.email().replace('@', `${i}@`),
                role: faker.helpers.arrayElement(['admin', 'customer']),
            }))
        );

        // Create Venues
        console.log('Creating venues...');
        const venues = await db.Venue.bulkCreate(
            Array.from({ length: NUM_VENUES }, (_, i) => ({
                name: faker.company.name(),
                location: faker.location.streetAddress(),
                max_occupancy: faker.number.int({ min: 50, max: 500 }),
                email: faker.internet.email().replace('@', `${i}@`),
                phone: faker.phone.number(),
            }))
        );

        // Create Event Types
        console.log('Creating event types...');
        const eventTypes = await db.EventType.bulkCreate(
            EVENT_TYPES.map(type => ({ name: type }))
        );

        // Create Roles
        console.log('Creating roles...');
        const roles = await db.Role.bulkCreate(
            DEPT_LIST.map(dept => ({
                role_name: faker.person.jobTitle(),
                dept_name: dept,
                min_salary: faker.finance.amount(300, 1000, 2),
                max_salary: faker.finance.amount(1000, 5000, 2),
            }))
        );

        // Create Customers
        console.log('Creating customers...');
        const customers = await db.Customer.bulkCreate(
            Array.from({ length: NUM_CUSTOMERS }, () => ({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                organizationName: faker.company.name(),
                phoneNumber: faker.phone.number(),
                userId: faker.helpers.arrayElement(users).userId,
            }))
        );

        // Create Attendees
        console.log('Creating attendees...');
        await db.Attendee.bulkCreate(
            Array.from({ length: NUM_ATTENDEES }, () => ({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                gender: faker.helpers.arrayElement(['male', 'female', 'other']),
                phoneNumber: faker.phone.number(),
                userId: faker.helpers.arrayElement(users).userId,
            }))
        );

        // Create Caterings
        console.log('Creating caterings...');
        const caterings = await db.Catering.bulkCreate(
            Array.from({ length: NUM_CATERINGS }, () => ({
                catering_set: faker.commerce.productName(),
                price: faker.finance.amount(10, 100, 2),
            }))
        );

        // Create Events
        console.log('Creating events...');
        const events = await db.Event.bulkCreate(
            Array.from({ length: NUM_EVENTS }, () => {
                const startDate = faker.date.future();
                const endDate = faker.date.future({ refDate: startDate });
                return {
                    name: faker.lorem.words(3),
                    startDate,
                    end_date: endDate,
                    desc: faker.lorem.paragraph(),
                    budget: faker.finance.amount(1000, 10000, 2),
                    status: faker.helpers.arrayElement(['pending', 'denied', 'accepted']),
                    eventTypeId: faker.helpers.arrayElement(eventTypes).eventTypeId,
                    venueId: faker.helpers.arrayElement(venues).venueId,
                    custId: faker.helpers.arrayElement(customers).custId,
                };
            })
        );

        // Create Employees
        console.log('Creating employees...');
        await db.Employee.bulkCreate(
            Array.from({ length: NUM_EMPLOYEES }, (_, i) => ({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                DOB: faker.date.birthdate(),
                gender: faker.helpers.arrayElement(['male', 'female', 'other']),
                email: faker.internet.email().replace('@', `${i}@`),
                phone: faker.phone.number(),
                roleId: faker.helpers.arrayElement(roles).roleId,
                salary: faker.finance.amount(500, 5000, 2),
            }))
        );

        // Assign Employees to Events
        console.log('Assigning employees to events...');
        const employeeEvents = [];
        for (const event of events) {
            const assignedEmployees = faker.helpers.arrayElements(await db.Employee.findAll(), { min: 2, max: 5 });
            for (const emp of assignedEmployees) {
                employeeEvents.push({
                    eventId: event.eventId,
                    empId: emp.empId,
                });
            }
        }
        await db.EmployeeEvent.bulkCreate(employeeEvents);

        // Assign Catering to Events
        console.log('Assigning catering to events...');
        const eventCaterings = [];
        for (const event of events) {
            const assignedCaterings = faker.helpers.arrayElements(caterings, { min: 1, max: 3 });
            for (const catering of assignedCaterings) {
                eventCaterings.push({
                    eventId: event.eventId,
                    cateringId: catering.cateringId,
                });
            }
        }
        await db.EventCatering.bulkCreate(eventCaterings);


        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();