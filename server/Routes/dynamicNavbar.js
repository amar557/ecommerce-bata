import express from "express";
import { findCategory } from "../controller/nav.controller.js";
const dynamicNavbar = express.Router();
dynamicNavbar.get("/nav", findCategory);
export default dynamicNavbar;
