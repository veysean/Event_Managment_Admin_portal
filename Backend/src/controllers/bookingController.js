import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *     name: Events
 *     description: Booking event routes
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: get all event bookings
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *       - in: query
 *         name: venue
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, denied]
 *       - in: query
 *         name: populate
 *         schema:
 *          type: string
 *          enum: ["customer", "venue", "eventType"]
 *     responses:
 *       200:
 *         description: List of bookings
 */
export const getAllEvents = async (req, res) => {
  const { date, venue, status, populate } = req.query;
  const total = await db.Event.count();
  try {
    const events = await db.Event.findAll({
      where: {
        ...(date && { date }),
        ...(venue && { venue }),
        ...(status && { status }),
      },
      include: populate ? [{ model: db[populate] }] : [],
    });

    res.json({ total, events });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

