/**
 * @swagger
 * tags:
 *     name: Catering
 *     description: Catering management routes
 */
/**
 * @swagger
 * /api/catering:
 *   get:
 *     summary: List catering options
 *     tags: [Catering]
 *     responses:
 *       200:
 *         description: List of catering options
 *   post:
 *     summary: Add a catering option
 *     tags: [Catering]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, menu, price, availability]
 *             properties:
 *               name:
 *                 type: string
 *               menu:
 *                 type: string
 *               price:
 *                 type: number
 *               availability:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catering option created
 */

/**
 * @swagger
 * /api/catering/{id}:
 *   put:
 *     summary: Edit catering option
 *     tags: [Catering]
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
 *               menu:
 *                 type: string
 *               price:
 *                 type: number
 *               availability:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catering option updated
 *   delete:
 *     summary: Delete catering option
 *     tags: [Catering]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Catering option deleted
 */