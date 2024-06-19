import express from "express"

import { requireAuth } from "../middleware/requireAuth.js";

// controller fonctions :


import  {signUpUser , loginUser , updateProfile ,getAllUsers , 
            sendInvitation ,userInvitaions , acceptInvitation , refusInvitation ,
            lesAmisUser , deleteAmi , storVerification , verifymail , verfierExistMail,
            changePassword , consultation} from "../controllers/userController.js"

const router = express.Router();

// require auth for all routes
// router.use(requireAuth)

// login Route 

router.post('/login' , loginUser);
// signUp Route 
router.post('/signup' , signUpUser);

// store verification 
router.post('/storeverification' , storVerification)

// verification mail 

router.post('/verifymail' , verifymail )

router.put("/profile" , updateProfile)

// get all users 
router.get("/all" , getAllUsers)

// send Invitation 
router.put("/sendinvitaion/:idUser" , sendInvitation)
// listes des invitation user
router.get("/invitation" , userInvitaions)
// accept invitation 
router.put("/invitation/accept/:idUserAccept" , acceptInvitation) 

// refus invitation 
router.put("/invitation/refus/:idUserRefus" , refusInvitation)

// afficher la liste des amis 
router.get("/amis", lesAmisUser)

// supprimer invitation 
router.delete("/amis/:idAmi" , deleteAmi)

// verifier existe email in forget password
router.post("/forgetpassword/veryexistMail" , verfierExistMail)

// changePassword 
router.put("/forgetpassword" , changePassword)

// consulte invitation or AMIS 

router.put("/consult" , consultation)

export default router;
