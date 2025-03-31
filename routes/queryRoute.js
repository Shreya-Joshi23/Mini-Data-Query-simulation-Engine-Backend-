import { Router } from "express";
import { authmiddleware } from "../middlewares/authmiddleware.js";
import { checkisvalid, executequery, quesTosql } from "../controllers/Query/query.js";

const queryRouter=Router();

// user provides question and we have to provide answer from database

// /query: Accepts natural language query
// /explain: Returns simulated query breakdown
// /validate: Checks query feasibility

queryRouter.get('/query',authmiddleware,executequery)
queryRouter.get('/explain',authmiddleware,quesTosql)
queryRouter.get('/validate',authmiddleware,checkisvalid)

export default queryRouter