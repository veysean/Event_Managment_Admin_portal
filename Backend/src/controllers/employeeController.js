import db from '../models/index.js';
/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Retrieve all employees or filter by role name
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter employees by role name
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
 *     responses:
 *       200:
 *         description: A list of employees or filtered employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of matching employees
 *                 limit:
 *                   type: integer
 *                   description: Number of records returned
 *                 offset:
 *                   type: integer
 *                   description: Number of records skipped
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       empId:
 *                         type: integer
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: object
 *                         properties:
 *                           roleId:
 *                             type: integer
 *                           role_name:
 *                             type: string
 *       500:
 *         description: Server error
 */
export const getEmployees = async (req, res) => {
  try {
    const { role, limit = 10, offset = 0 } = req.query;

    const roleFilter = role ? { role_name: role } : undefined;

    const include = [{
      model: db.Role,
      as: 'role',
      attributes: ['roleId', 'role_name'],
      where: roleFilter
    }];

    // Use findAndCountAll instead of separate count and findAll
    const { count: total, rows: employees } = await db.Employee.findAndCountAll({
      include,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
};

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - roleId
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Kem"
 *               lastName:
 *                 type: string
 *                 example: "Veysean"
 *               DOB:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-20"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "kem.veysean@example.com"
 *               phone:
 *                 type: string
 *                 example: "+85512345678"
 *               roleId:
 *                 type: integer
 *                 example: 2
 *               salary:
 *                 type: number
 *                 format: float
 *                 example: 1200.50
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const createEmployee = async (req, res) => {
  const {
    firstName,
    lastName,
    DOB,
    gender,
    email,
    phone,
    roleId,
    salary
  } = req.body;


  if (!firstName || !lastName || !email || !phone || !roleId || !salary) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const existingEmployee = await db.Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists' });
    }

    const newEmployee = await db.Employee.create({
      firstName,
      lastName,
      DOB,
      gender,
      email,
      phone,
      roleId,
      salary
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee', details: error.message });
  }
};


/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update an existing employee (partial update supported, including file upload)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
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
 *               DOB:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               roleId:
 *                 type: integer
 *               salary:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    DOB,
    gender,
    email,
    phone,
    roleId,
    salary
  } = req.body;

  try {
    const employee = await db.Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updates = {};

    if (firstName !== undefined && firstName !== '') updates.firstName = firstName;
    if (lastName !== undefined && lastName !== '') updates.lastName = lastName;
    if (DOB !== undefined && DOB !== '') updates.DOB = DOB;
    if (gender !== undefined && gender !== '') updates.gender = gender;
    if (email !== undefined && email !== '') updates.email = email;
    if (phone !== undefined && phone !== '') updates.phone = phone;
    if (roleId !== undefined && !isNaN(parseInt(roleId))) updates.roleId = parseInt(roleId);
    if (salary !== undefined && !isNaN(parseFloat(salary))) updates.salary = parseFloat(salary);

    await employee.update(updates);

    res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee', details: error.message });
  }
};


/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete a employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to delete
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await db.Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await employee.destroy();

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Employee', details: error.message });
    }
};


