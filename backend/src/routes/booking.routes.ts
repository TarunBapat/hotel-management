import { Router } from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
} from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.post("/create", createBooking);
bookingRouter.get("/all", getBookings);
bookingRouter.get("/:id", getBookingById);
bookingRouter.delete("/:id", deleteBooking);

export default bookingRouter;
