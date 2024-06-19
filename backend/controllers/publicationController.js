import { log } from "console";
import { Publication } from "../models/publicationModel.js";
import { User } from "../models/userModel.js";
import multer from "multer";
import path from "path"
import jwt from "jsonwebtoken"

import { config } from "dotenv";
config();

// apload file

const getID= (req)=>{
    const {authorization} = req.headers 
    const token = authorization.split(' ')[1] 
    const {_id } = jwt.verify(token , process.env.SECRET)
    return _id
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });


const ajouterPublication = async(req , res)=>{
 
    upload.single('photo')(req, res, async function (err) {
       
        const newData = req.body;   

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Une erreur s\'est produite lors de l\'envoi du fichier.' });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        const user_id = req.user._id 

        // Le fichier est stocké dans req.file
        let photo = "";

        if(req.file){
             photo = req.file.filename;
        }

        newData.photo = photo

        
        try {
            const publication = await Publication.add(user_id , newData)

            const user = await User.addPublicationToUser(user_id , publication)
            

            res.status(200).json({publication });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

     });


}

const allPublications = async(req , res)=>{
    try{
       
        const _id =  getID(req)
        const amis = await User.getAmis(_id)

        const publications = await Publication.tousPublications(amis)

        res.status(200).json(publications)

    }catch (error){
        res.status(400).json({error : error.message})

    }

}

const allPublicationsUser = async(req , res)=>{
    
    try{
        const user_id = req.user._id 
       
        const publications = await Publication.tousPublicationsUser(user_id)
        

        res.status(200).json(publications)

    }catch (error){
        res.status(400).json({error : error.message})

    }

}


const detailsProfile = async(req , res)=>{

    const profile_id = req.params.user_id;

    try{
        const publications = await Publication.tousPublicationsUser(profile_id)
        const user_id = req.user._id 
        let profile_user = false 
        if (user_id == profile_id){
            profile_user = true
        }

        const user = await User.selectUser(profile_id)

        res.status(200).json({publications , profile_user , user})

    }catch (error){
        res.status(400).json({error : error.message})

    }

}

const deletePublication = async (req , res) =>{ 
    const idPublication = req.params.idPublication 
   
    try{
        const result = await Publication.deletePub(idPublication)
        res.status(200).json({id : idPublication })
    }catch(error){
        res.status(400).json({error : error.message})
    }
}

const updatePublication = async (req, res) => {
    upload.single('photo')(req, res, async function (err) {
        const newData = req.body;   
        const idPublication = req.params.idPublication;

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Une erreur s\'est produite lors de l\'envoi du fichier.' });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if(req.file){
             const photo = req.file.filename;
             newData.photo = photo
        }

        
        try {
            const publication = await Publication.updatePub(idPublication , newData)

            res.status(200).json({publication });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

     });

    // upload.single('photo')(req, res, async function (err) {
    //     try {
    //         if (err instanceof multer.MulterError) {
    //             return res.status(400).json({ error: 'Une erreur s\'est produite lors de l\'envoi du fichier.' });
    //         } else if (err) {
    //             return res.status(500).json({ error: err.message });
    //         }

    //         if (req.file) {
    //             newData.photo = req.file.filename;
    //         }

    //         log(newData)
    //         const publication = await Publication.updatePub(idPublication, newData);
    //         // Répondre avec la publication mise à jour
    //         res.status(200).json(publication);
    //     } catch (error) {
    //         res.status(400).json({ error: error.message });
    //     }
    // });
};

export {ajouterPublication , allPublications , allPublicationsUser , detailsProfile , deletePublication , updatePublication}