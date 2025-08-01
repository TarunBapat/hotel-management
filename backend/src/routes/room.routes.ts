import { Router } from "express";
import { getAllRooms } from "../controllers/room.controller";

const roomRouter = Router();

roomRouter.get("/all", getAllRooms);

export default roomRouter;
