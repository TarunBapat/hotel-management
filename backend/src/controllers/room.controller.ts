import { pool } from "../config/db.config";
import { Request, Response } from "express";

const getAllRooms = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms");
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllRooms };
