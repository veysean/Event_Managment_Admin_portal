import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   - name: Catering
 *     description: Catering management
 */

/**
 * @swagger
 * /api/caterings:
 *   get:
 *     summary: Retrieve all catering sets or filter by cateringId
 *     tags: [Catering]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cateringId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter catering sets by cateringId
 *     responses:
 *       200:
 *         description: A list of catering sets or a single set if filtered
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cateringId:
 *                     type: integer
 *                     example: 1
 *                   cateringSet:
 *                     type: string
 *                     example: "Premium Buffet"
 *                   price:
 *                     type: number
 *                     format: decimal
 *                     example: 45.99
 *                   imageUrl:
 *                     type: string
 *                     format: uri
 *                     example: "/uploads/16273829123-premium.jpg"
 *       500:
 *         description: Server error
 */

export const getCaterings = async (req, res) => {
  try {
    const { cateringId } = req.query;

    const whereClause = cateringId ? { cateringId } : {};

    const caterings = await db.Catering.findAll({ where: whereClause });

    res.status(200).json(caterings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catering data.' });
  }
};

/**
 * @swagger
 * /api/caterings:
 *   post:
 *     summary: Create a new catering set with image
 *     tags: [Catering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cateringSet
 *               - price
 *             properties:
 *               cateringSet:
 *                 type: string
 *                 example: "Standard Buffet"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 25.50
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Catering set created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cateringId:
 *                   type: integer
 *                   example: 1
 *                 cateringSet:
 *                   type: string
 *                   example: "Standard Buffet"
 *                 price:
 *                   type: number
 *                   format: decimal
 *                   example: 25.50
 *                 imageUrl:
 *                   type: string
 *                   format: uri
 *                   example: "/uploads/16273829123-standard.jpg"
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */


export const createCatering = async (req, res) => {
  try {
    const { cateringSet, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!cateringSet || price === undefined) {
      return res.status(400).json({ error: 'cateringSet and price are required.' });
    }

    const newCatering = await db.Catering.create({ cateringSet, price, imageUrl });

    res.status(201).json(newCatering);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create catering set.' });
  }
};

/**
 * @swagger
 * /api/caterings/{id}:
 *   put:
 *     summary: Update an existing catering set (partial update supported, including image upload)
 *     tags: [Catering]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the catering set to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cateringSet:
 *                 type: string
 *                 description: Name of the catering set
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Price of the catering set
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Catering updated successfully
 *       404:
 *         description: Catering not found
 *       500:
 *         description: Server error
 */


export const updateCatering = async (req, res) => {
    const { id } = req.params;
    const { cateringSet, price } = req.body;
    const imageFile = req.file;

    try {
        const catering = await db.Catering.findByPk(id);
        if (!catering) {
            return res.status(404).json({ error: 'Catering not found' });
        }

        const updates = {};

        if (cateringSet !== undefined && cateringSet !== '') {
            updates.cateringSet = cateringSet;
        }

        if (price !== undefined && price !== '' && !isNaN(parseFloat(price))) {
            updates.price = parseFloat(price);
      }



        if (imageFile) {
            updates.imageUrl = `/uploads/${imageFile.filename}`;
        }

        await catering.update(updates);

        res.status(200).json({
            message: 'Catering updated successfully',
            catering
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update catering', details: error.message });
    }
};


/**
 * @swagger
 * /api/caterings/{id}:
 *   delete:
 *     summary: Delete a catering set by ID
 *     tags: [Catering]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the catering set to delete
 *     responses:
 *       200:
 *         description: Catering deleted successfully
 *       404:
 *         description: Catering not found
 *       500:
 *         description: Server error
 */
export const deleteCatering = async (req, res) => {
    const { id } = req.params;

    try {
        const catering = await db.Catering.findByPk(id);
        if (!catering) {
            return res.status(404).json({ error: 'Catering not found' });
        }

        await catering.destroy();

        res.status(200).json({ message: 'Catering deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete catering', details: error.message });
    }
};
