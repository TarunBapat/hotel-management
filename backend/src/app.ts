import express from "express";
import { pool } from "./config/db.config";
import customerRouter from "./routes/customer.routes";
import bookingRouter from "./routes/booking.routes";
import roomRouter from "./routes/room.routes";
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "admin"],
  })
);
app.use(express.json());

app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from rooms");
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Error querying database");
  }
});

app.get("/", (req, res) => {
  res.send("working");
});

app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/rooms", roomRouter);

app.listen(5001, () => {
  console.log("Server running on http://localhost:5000/");
});
