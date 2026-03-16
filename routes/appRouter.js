import { Router } from "express";
import indexRoute from './indexRoute.js';
import authRoute from './authRoute.js';
import postRoute from './postRoute.js';
import communityRoute from './communityRoute.js';
import router from "./indexRoute.js";

const appRouter = Router();

router.use('/', indexRoute);
router.use('/', authRoute);
router.use('/post', postRoute);
router.use('/communities', communityRoute);

export default router;

