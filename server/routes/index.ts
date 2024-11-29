import { Router } from 'express';

/* Routes */
import Auth from './auth';
import Chats from './chats';

const router = Router();

router.use("/auth", Auth);
router.use("/chats", Chats);

export default router;