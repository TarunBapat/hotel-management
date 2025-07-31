import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  searchCustomer,
} from "../controllers/customer.controller";

const customerRouter = Router();

customerRouter.post("/create", createCustomer);
customerRouter.get("/all", getCustomers);
customerRouter.get("/search", searchCustomer);
customerRouter.get("/:id", getCustomerById);

export default customerRouter;
