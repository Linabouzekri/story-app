import { mongoose } from "mongoose";


const Schema = mongoose.Schema

const publicationSchema = new Schema({
 
    photo : {
        type : String , 
    },
    description : {
        type : String , 
        required : true,
        
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

publicationSchema.statics.add = async function(user_id , newData ){


    // validation emial password 
    if (!newData.description){
        throw Error("All fields must be filled")
    }

    const description = newData.description
    const photo = newData.photo
   

    const publication = await  this.create({
        description , 
        photo , 
        user : user_id
    })


    const publication_add = await this.findOne().populate({
        path : "user",
        select : "email userName photo phone description"
    }).sort({ _id: -1 });;


    return publication_add
}

publicationSchema.statics.tousPublications = async function(amis){

    const publications = await  this.find({user : { $in: amis }  }).populate({
        path : "user",
        select : "email userName photo phone description"
    }).sort({ _id: -1 });;
   // console.log("publications" , publications);

    return publications
}

publicationSchema.statics.tousPublicationsUser = async function(user_id){

    const publications = await  this.find({user: user_id }).populate({
        path : "user",
        select : "email userName photo phone description"
    }).sort({ _id: -1 });;
   // console.log("publications" , publications);

    return publications
}

publicationSchema.statics.deletePub =async function(_id){
    const result = await this.deleteOne({_id})
    if (result.deletedCount === 0){
        throw Error("Publication n'existe pas");
    }
    return result
}


publicationSchema.statics.updatePub =async function (_id , newData){

    const publication = await this.findOne({_id}) 

    if (newData.description) {
        
        publication.description = newData.description;
    }

    if (newData.photo !== 'null'  ) {
        console.log("photo" , newData.photo);
        publication.photo = newData.photo;
    }

    const updatedpublication = await publication.save();

    const pubUpdated =  await this.findOne().populate({
        path : "user",
        select : "email userName photo phone description"
    }).sort({ _id: -1 });;

    return pubUpdated

}

export const Publication = mongoose.model('Publication' , publicationSchema);