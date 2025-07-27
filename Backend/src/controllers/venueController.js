import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *     name: Venues
 *     description: Venue management routes
 */
/**
 * @swagger
 * /venues:
 *   get:
 *     summary: List all venues
 *     tags: [Venues]
 *     responses:
 *       200:
 *         description: List of venues
 *   post:
 *     summary: Add a new venue
 *     tags: [Venues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location, capacity, availability]
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               availability:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Venue created successfully
 */

/**
 * @swagger
 * /venues/{id}:
 *   put:
 *     summary: Edit a venue
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               availability:
 *                 type: string
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *   delete:
 *     summary: Delete a venue
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Venue deleted successfully
 */


const venueController = {
  async getAllVenues(req, res) {

    try {
      const venues = await db.Venue.findAll();
      res.status(200).json(venues);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch venues' });
    }
  },

  async createVenue(req, res) {
    try {
      const { name, location, capacity, availability, image } = req.body;
      const newVenue = await db.Venue.create({ name, location, capacity, availability, image });
      res.status(201).json(newVenue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create venue' });
    }
  },

  async updateVenue(req, res) {
    try {
      const { id } = req.params;
      const { name, location, capacity, availability } = req.body;
      const venue = await db.Venue.findByPk(id);

      if (!venue) return res.status(404).json({ error: 'Venue not found' });

      await venue.update({ name, location, capacity, availability });
      res.status(200).json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update venue' });
    }
  },

  async deleteVenue(req, res) {
    try {
      const { id } = req.params;
      const venue = await db.Venue.findByPk(id);

      if (!venue) return res.status(404).json({ error: 'Venue not found' });

      await venue.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete venue' });
    }
  }
};

export default venueController;