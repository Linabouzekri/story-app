
import { User } from "../models/userModel.js";
import { verificationMail } from "../models/verificationMailModel.js";
import jwt from "jsonwebtoken"

import multer from "multer";
import path from "path";
import { config } from "dotenv";
import {transporter , sendMail} from "../sendMail.js"
config();


// apload file

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const createToken = (_id)=>{
    return jwt.sign({_id} , process.env.SECRET , { expiresIn : '3d'})

}


const getID= (req)=>{
    const {authorization} = req.headers 
    const token = authorization.split(' ')[1] 
    const {_id } = jwt.verify(token , process.env.SECRET)
    return _id
}

// login User 

const loginUser = async (req , res) =>{
    const {email , password} = req.body

    try{
        const user = await User.login(email , password)
        
        // create a token  
        const userName = user.userName;
        const photo = user.photo ; 
        const phone = user.phone ; 
        const description = user.description
        const notifications = user.notifications
        const token = createToken(user._id);

        res.status(200).json({email ,phone , photo , userName, description , notifications, token})

    }catch (error){
        res.status(400).json({error : error.message})

    }

}

// SignUp User 

const signUpUser = async (req, res) => {
  

    upload.single('photo')(req, res, async function (err) {
        const { email, password, userName, phone } = req.body;
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Une erreur s\'est produite lors de l\'envoi du fichier.' });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Le fichier est stocké dans req.file
        let photo = "avatar.jpg";
        if(req.file){
             photo = req.file.filename;
        }



        try {
            const user = await User.signup(email, password, userName, phone, photo);

            // create a token
            const token = createToken(user._id);

            res.status(200).json({ email, userName , photo , phone, token , description :""  });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}

// verification Mail 

const storVerification = async(req , res)=>{

    const email = req.body.email 

    try{
        const code = Math.floor(1000 + Math.random() * 9000).toString() 
        const verification  =  await verificationMail.store(email , code)
        // send mail 
        const to = [email]
        const subject = "Verification Email"
        const message = `Bonjour ,\nPour finaliser votre inscription, veuillez utiliser le code suivant pour vérifier votre adresse e-mail : \nCode de vérification : ${code} \nVeuillez entrer ce code dans l'application pour confirmer votre adresse e-mail.\n\nCordialement,`
        const mailOption = {
            from: {
                name : process.env.NAME_APP,
                address : process.env.USER
            },
            to: to, subject, 
            text: message, 
        };

        sendMail(transporter , mailOption)
        
        res.status(200).json(true)

    }catch(error){
        res.status(400).json({error : error.message})
    }

    // enregestre les information dans model VerificationMails 
}
// verify Mail 

const verifymail = async (req , res)=>{
    const email = req.body.email 
    const code = req.body.code
    try{
        
        const verification  =  await verificationMail.verify(email , code)
        // ajouter send mail vers user 

        res.status(200).json(verification)

    }catch(error){
        res.status(400).json({error : error.message})
    }
}



const updateProfile = async(req , res) =>{
   


    upload.single('photo')(req, res, async function (err) {
       
        const newData = req.body;
   

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Une erreur s\'est produite lors de l\'envoi du fichier.' });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        const _id = getID(req) 
        const user = await User.findById(_id);

        // Le fichier est stocké dans req.file
        let photo = user.photo;

        if(req.file){
             photo = req.file.filename;
        }

        newData.photo = photo
        newData._id = _id
        

        try {
            const user = await User.updateUser( _id,newData);

            const email = user.email ;
            const userName = user.userName ; 
            const photo = user.photo ;
            const phone = user.phone; 
            const description = user.description ;

            // create a token
            const token = createToken(user._id);

            res.status(200).json({ email, userName , photo , phone, description , token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

     });

}


const getAllUsers = async(req , res) =>{
    try{    

        const _id = getID(req) 
        const users = await User.getAll(_id);
        
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//send Invitaion  

const sendInvitation = async (req , res) =>{
    const idfriend = req.params.idUser 
    try{    
        const _id = getID(req) 
        const id = await User.envoyerInvitation(idfriend , _id);
        //const users = result.filter(user => user._id != _id )

        res.status(200).json({id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// les invitation d'un utilisateur

const userInvitaions = async (req , res) =>{

    try{    
        const _id = getID(req) 
        const users = await User.invitations(_id);

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// accept invitation user  

const acceptInvitation = async (req , res)=>{
    const idUserAccept = req.params.idUserAccept 

    try{    
        const _id = getID(req) 
        const id = await User.acceptInv(_id , idUserAccept);

        res.status(200).json({id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const refusInvitation = async (req , res) =>{
    const idUserRefus = req.params.idUserRefus 

    try{    
        const _id = getID(req) 
        const id = await User.refusInv(_id , idUserRefus);

        res.status(200).json({id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const lesAmisUser = async (req , res)=>{
    try{    
        const _id = getID(req) 
        const  users= await User.amisUser(_id);

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteAmi = async (req , res)=>{
    const idAmi = req.params.idAmi 
    try{    
        const _id = getID(req) 
        const  id= await User.supprimerAmi(_id , idAmi);

        res.status(200).json({id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


}

// verifier Exist Email

const verfierExistMail = async (req , res)=>{
    
    try{    
        const email = req.body.email
        const  result = await User.verifyExistEmail(email);

        if(result){
            const code = Math.floor(1000 + Math.random() * 9000).toString() 
            const verification  =  await verificationMail.store(email , code)
            // send mail 
            const to = [email]
            const subject = "réinitialisation Password "
            const message = `Bonjour,\n\nNous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Veuillez utiliser le code suivant pour réinitialiser votre mot de passe : \n\nCode de réinitialisation : ${code} .\n\nCordialement,`
            const mailOption = {
                from: {
                    name : process.env.NAME_APP,
                    address : process.env.USER
                },
                to: to, subject, 
                text: message, 
            };

            sendMail(transporter , mailOption)

        }

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const changePassword = async (req , res)=>{ 
    try{    
        const email = req.body.email 
        const password = req.body.password 

        const  result= await User.updatePassword(email ,password);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// consultation ami or invitation

const consultation = async(req, res)=>{
    try{    
        const type = req.body.type
        //const id = req.body.id 

        const id = getID(req) 
        
        const result = await User.consult(id , type);

        res.status(200).json(result.notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export { signUpUser , loginUser  , updateProfile ,getAllUsers , sendInvitation ,userInvitaions , acceptInvitation ,
        refusInvitation , lesAmisUser , deleteAmi , storVerification , verifymail, verfierExistMail , changePassword , consultation}