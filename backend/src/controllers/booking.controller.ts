import { pool } from "../config/db.config";
import { Request, Response } from "express";

const createBooking = async (req: Request, res: Response) => {
  const { customer, booking } = req.body;
  console.log("Received booking data:", { customer, booking });

  const {
    firstname,
    lastname,
    email,
    phone,
    address,
    id_proof_type,
    id_proof_number,
  } = customer;
  const {
    checkIn,
    checkOut,
    totalAmount: amount_paid,
    roomType,
    guests,
    specialRequests,
    status,
  } = booking;

  const [roomDetails]: any = await pool.query(
    "SELECT id FROM rooms WHERE number = ?",
    [roomType]
  );

  const roomId = roomDetails[0]?.id;

  const [checkExistingUser]: any = await pool.query(
    "SELECT id FROM customers WHERE email = ? OR firstname = ?",
    [email, firstname]
  );
  let customerId;
  if (checkExistingUser.length > 0) {
    customerId = checkExistingUser[0]?.id;
  } else {
    const [result] = await pool.query(
      "INSERT INTO customers (firstname, lastname, email, phone, address,id_proof_type,id_proof_number) VALUES (?,?, ?, ?, ?,?,?)",
      [
        firstname,
        lastname,
        email,
        phone,
        address,
        id_proof_type,
        id_proof_number,
      ]
    );
    customerId = result.insertId;
  }
  try {
    await pool.query(
      "INSERT INTO bookings (customer_id, room_id, check_in, check_out,amount_paid,guests,specialRequests,status) VALUES (?,?,?,?,?,?,?,?)",
      [
        customerId,
        roomId,
        checkIn,
        checkOut,
        amount_paid,
        guests,
        specialRequests,
        status,
      ]
    );
    await pool.query("UPDATE rooms SET status = ? WHERE id = ?", [
      "Occupied",
      roomId,
    ]);

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query("SELECT * FROM bookings");
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (result?.length == 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);
    if (!result) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createBooking, getBookings, getBookingById, deleteBooking };
