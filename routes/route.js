import { Router } from "express";
import authRouter from "./authRoute.js";
import queryRouter from "./queryRoute.js";

const appRouter=Router();

appRouter.use('/auth',authRouter);
appRouter.use('/query',queryRouter)

export default appRouter