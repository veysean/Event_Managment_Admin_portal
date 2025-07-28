import db from '../models/index.js';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve all events or filter by eventId, eventType name, custId, venueId, status
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter events by event ID
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           enum: [Conference, Workshop, Seminar, Concert, Festival]
 *         required: false
 *         description: Filter events by event type name
 *       - in: query
 *         name: custId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter events by customer ID
 *       - in: query
 *         name: venueId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter events by venue ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, denied, accepted, cancelled]
 *         required: false
 *         description: Filter events by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: Number of records to skip
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [EventId, name, budget]
 *           default: EventId
 *         required: false
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         required: false
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: A list of events or filtered events
 *       500:
 *         description: Server error
 *
 * /api/events/{id}:
 *   put:
 *     summary: Partially update an existing event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               desc:
 *                 type: string
 *               budget:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: string
 *                 enum: [pending, denied, accepted, cancelled]
 *               eventTypeId:
 *                 type: integer
 *               venueId:
 *                 type: integer
 *               custId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

const validStatuses = ['pending', 'denied', 'accepted', 'cancelled'];
const validEventTypes = ['Conference', 'Workshop', 'Seminar', 'Concert', 'Festival'];
const validSortFields = ['EventId', 'name', 'budget'];
const validSortOrders = ['ASC', 'DESC'];

export const getEvents = async (req, res) => {
  try {
    const {
      eventId,
      eventType,
      custId,
      venueId,
      status,
      limit = 10,
      offset = 0,
      sortBy = 'EventId',
      sortOrder = 'ASC'
    } = req.query;

    const filters = {};
    if (eventId) filters.EventId = eventId;
    if (custId) filters.custId = custId;
    if (venueId) filters.venueId = venueId;
    if (status && validStatuses.includes(status)) {
      filters.status = status;
    } else if (status) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const include = [
      {
        model: db.EventType,
        as: 'eventType',
        ...(eventType && validEventTypes.includes(eventType)
          ? { where: { name: eventType } }
          : {})
      },
      {
        model: db.Venue,
        as: 'venue'
      },
      {
        model: db.Catering,
        as: 'catering'
      }
    ];

    if (eventType && !validEventTypes.includes(eventType)) {
      return res.status(400).json({ message: 'Invalid event type value' });
    }

    const order = validSortFields.includes(sortBy)
      ? [[sortBy, validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC']]
      : [['startDate', 'ASC']];

    const events = await db.Event.findAll({
      where: filters,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    res.status(200).json({ total: events.length, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] === '') {
        delete updates[key];
      }
    });

    if (updates.status && !validStatuses.includes(updates.status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (updates.startDate && updates.endDate) {
      if (new Date(updates.endDate) <= new Date(updates.startDate)) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }
    }

    if (updates.budget !== undefined && parseFloat(updates.budget) <= 0) {
      return res.status(400).json({ error: 'Budget must be a non-negative number' });
    }

    ['budget', 'eventTypeId', 'venueId', 'custId'].forEach((field) => {
      if (updates[field]) {
        updates[field] = Number(updates[field]);
      }
    });

    await event.update(updates);

    const updatedEvent = await db.Event.findByPk(id, {
      include: [
        { model: db.EventType, as: 'eventType' },
        { model: db.Venue, as: 'venue' },
        { model: db.Catering, as: 'catering' }
      ]
    });

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
};


/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

