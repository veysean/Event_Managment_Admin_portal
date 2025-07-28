import db from '../models/index.js';

export const getAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRole = async (req, res) => {
  try {
    const newRole = await db.Role.create(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(400).json({ message: "Invalid input data", error });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.update(req.body);
    res.status(200).json(role);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(400).json({ message: "Invalid input data", error });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.destroy();
    res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
