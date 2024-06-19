import express from "express"
import { requireAuth } from "../middleware/requireAuth.js";

import { ajouterPublication , allPublications , allPublicationsUser , detailsProfile , deletePublication , updatePublication} from "../controllers/publicationController.js";

const router = express.Router();

router.use(requireAuth)

router.post('/add' , ajouterPublication);
router.put("/:idPublication" , updatePublication)
router.delete('/:idPublication' , deletePublication)
router.get('/' , allPublications);
router.get('/profile' , allPublicationsUser);
router.get('/profile/details/:user_id', detailsProfile)


export default router;