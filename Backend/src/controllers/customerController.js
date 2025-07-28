import db from '../models/index.js';

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Retrieve all customers or filter by custId with pagination
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: custId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter customers by custId
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: A paginated list of customers or a single customer if filtered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       custId:
 *                         type: integer
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         example: "Kem"
 *                       lastName:
 *                         type: string
 *                         example: "Veysean"
 *                       organizationName:
 *                         type: string
 *                         example: "Tech Solutions"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+85512345678"
 *                       userId:
 *                         type: integer
 *                         example: 2
 *       500:
 *         description: Server error
 */

export const getCustomers = async (req, res) => {
  try {
    const { custId, page = 1, limit = 10 } = req.query;

    const whereClause = custId ? { custId } : {};

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await db.Customer.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer data.' });
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update an existing customer (partial update supported, including file upload)
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the customer to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               organizationName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, organizationName, phoneNumber, userId } = req.body;
  

  try {
    const customer = await db.Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const updates = {};

    if (firstName !== undefined && firstName !== '') updates.firstName = firstName;
    if (lastName !== undefined && lastName !== '') updates.lastName = lastName;
    if (organizationName !== undefined && organizationName !== '') updates.organizationName = organizationName;
    if (phoneNumber !== undefined && phoneNumber !== '') updates.phoneNumber = phoneNumber;
    if (userId !== undefined && !isNaN(parseInt(userId))) updates.userId = parseInt(userId);

    await customer.update(updates);

    res.status(200).json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer', details: error.message });
  }
};



/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of customer to delete
 *     responses:
 *       200:
 *         description: Catering deleted successfully
 *       404:
 *         description: Catering not found
 *       500:
 *         description: Server error
 */
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db.Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check for related events
    const relatedEvents = await db.Event.findAll({ where: { custId: id } });
    if (relatedEvents.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete customer with existing events',
        details: `Customer ID ${id} is linked to ${relatedEvents.length} event(s).`,
      });
    }

    // Safe to delete
    await customer.destroy();
    res.status(200).json({ message: 'Customer deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer', details: error.message });
  }
};