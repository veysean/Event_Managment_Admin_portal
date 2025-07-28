import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   - name: Venues
 *     description: Venue management
 */

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Retrieve all venues or filter by venueId
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: venueId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter venues by venueId
 *     responses:
 *       200:
 *         description: A list of venues or a single venue if filtered
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   venueId:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Grand Hall"
 *                   location:
 *                     type: string
 *                     example: "Phnom Penh"
 *                   max_occupancy:
 *                     type: integer
 *                     example: 500
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "info@grandhall.com"
 *                   phone:
 *                     type: string
 *                     example: "+85512345678"
 *                   imageUrl:
 *                     type: string
 *                     format: uri
 *                     example: "/uploads/16273829123-grandhall.jpg"
 *       500:
 *         description: Server error
 */

export const getAllVenues = async (req, res) => {
    const { venueId } = req.query;

    try {
        let venues;

        if (venueId) {
            venues = await db.Venue.findAll({ where: { venueId } });
        } else {
            venues = await db.Venue.findAll();
        }

        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve venues', details: error.message });
    }
};


/**
 * @swagger
 * /api/venues:
 *   post:
 *     summary: Create a new venue
 *     tags: [Venues]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - max_occupancy
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Grand Hall"
 *               location:
 *                 type: string
 *                 example: "Phnom Penh"
 *               max_occupancy:
 *                 type: integer
 *                 example: 500
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "info@grandhall.com"
 *               phone:
 *                 type: string
 *                 example: "+85512345678"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Venue created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

export const createVenue = async (req, res) => {
    const { name, location, max_occupancy, email, phone } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !location || !max_occupancy || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingVenue = await db.Venue.findOne({ where: { email } });
        if (existingVenue) {
            return res.status(400).json({ error: 'Venue with this email already exists' });
        }

        const newVenue = await db.Venue.create({
            name,
            location,
            max_occupancy,
            email,
            phone,
            imageUrl
        });

        res.status(201).json({
            message: 'Venue created successfully',
            venue: newVenue
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create venue', details: error.message });
    }
};

/**
 * @swagger
 * /api/venues/{id}:
 *   put:
 *     summary: Update an existing venue (partial update supported)
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the venue to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               max_occupancy:
 *                 type: integer
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to upload
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       400:
 *         description: Invalid input (e.g., bad email or phone format)
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */


export const updateVenue = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const imageFile = req.file;

    try {
        const venue = await db.Venue.findByPk(id);
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        Object.keys(updates).forEach((key) => {
            if (updates[key] === '') {
                delete updates[key];
            }
        });

        // Validate email if provided
        if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate phone if provided
        if (updates.phone && !/^\+?[0-9\s\-]{7,15}$/.test(updates.phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        // Validate max_occupancy if provided
        if (updates.max_occupancy) {
            const occupancy = parseInt(updates.max_occupancy);
            if (isNaN(occupancy) || occupancy < 1) {
                return res.status(400).json({ error: 'max_occupancy must be a positive number' });
            }
            updates.max_occupancy = occupancy;
        }

        // Handle image upload
        if (imageFile) {
            updates.imageUrl = `/uploads/${imageFile.filename}`;
        }

        // Perform the update
        await venue.update(updates);

        res.status(200).json({
            message: 'Venue updated successfully',
            venue
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update venue', details: error.message });
    }
};


/**
 * @swagger
 * /api/venues/{id}:
 *   delete:
 *     summary: Delete a venue
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the venue to delete
 *     responses:
 *       200:
 *         description: Venue deleted successfully
 *       404:
 *         description: Venue not found
 *       500:
 *         description: Server error
 */


export const deleteVenue = async (req, res) => {
    const { id } = req.params;

    try {
        // Check for related events
        const relatedEvents = await db.Event.findAll({ where: { venueId: id } });

        if (relatedEvents.length > 0) {
            return res.status(400).json({
                error: 'Cannot delete venue with associated events',
                details: `There are ${relatedEvents.length} event(s) linked to this venue.`
            });
        }

        const venue = await db.Venue.findByPk(id);
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        await venue.destroy();
        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete venue', details: error.message });
    }
};
