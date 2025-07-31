import { pool } from "../config/db.config";
import { Request, Response } from "express";

const createCustomer = async (req: Request, res: Response) => {
  const { name, email, phone, id_proof_type, id_proof_number } = req.body;
  try {
    await pool.query(
      "INSERT INTO customers (name, email, phone, id_proof_type, id_proof_number,created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, id_proof_type, id_proof_number, new Date()]
    );
    res.status(201).json({ message: "customer added successfully" });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCustomers = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query("SELECT * FROM customers");
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCustomerById = async (req: Request, res: Response) => {
  console.log("hererere", req.params);
  const { id } = req.params;
  try {
    const [result] = await pool.query("SELECT * FROM customers WHERE id = ?", [
      parseInt(id),
    ]);
    if (result?.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchCustomer = async (req: Request, res: Response) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ message: "Missing search query" });
  }

  try {
    const [result] = await pool.query(
      "SELECT * FROM customers as C WHERE C.name LIKE ? OR C.phone LIKE ? LIMIT 10",
      [`%${term}%`, `%${term}%`]
    );
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error searching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { createCustomer, getCustomers, getCustomerById, searchCustomer };
