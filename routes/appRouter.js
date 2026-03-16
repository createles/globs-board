import { Router } from "express";
import indexRoute from './indexRoute.js';
import authRoute from './authRoute.js';
import postRoute from './postRoute.js';
import communityRoute from './communityRoute.js';
import router from "./indexRoute.js";

const appRouter = Router();

appRouter.use('/', indexRoute);
appRouter.use('/', authRoute);
appRouter.use('/post', postRoute);
appRouter.use('/communities', communityRoute);

export default appRouter;