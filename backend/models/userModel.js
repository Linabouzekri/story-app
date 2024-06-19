import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {
        type : String , 
        required : true, 
        unique : true , 
    },
    password : {
        type : String , 
        required : true,  
    },
    userName : {
        type : String , 
        required : true,  
    },
    photo : {
        type : String , 
    },
    phone : {
        type : String , 
        required : true,  
    },
    description : {
        type : String , 
        
    },
    notifications: {
        invitation: { type: Number, default: 0 },
        ami: { type: Number, default: 0 }
    },

    publications: [{
        type: Schema.Types.ObjectId,
        ref: 'Publication'
    }],

    friendRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    sendsRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

})

// static signup method 

userSchema.statics.signup = async function(email , password , userName ,phone ,photo ){
    const description = ""

    // validation emial password 
    if (!email , !password , !userName , !phone){
        throw Error("All fields must be filled")
    }
    if(!validator.isEmail(email)){
        throw Error("Email is not valid") 
    }

    if(!validator.isStrongPassword(password)){
        throw Error("Password not strong enough")
    }

    const exists = await this.findOne({ email })

    if (exists){
        throw Error("Email deja existe");
    }

    // hash password  

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password , salt); 

    const user = await  this.create({
        email , 
        password : hash ,
        phone , 
        userName,
        photo , 
        description
    })

    return user
}

// static login methode  

userSchema.statics.login = async function(email , password){
    // validation emial password 
    if (!email , !password){
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({ email })
    

    if (!user){
        throw Error("Incorrect Email"); 
    }

    const match = await bcrypt.compare(password , user.password)

    if (!match){
       throw Error('Incorrect password')
    }

    return user

}

userSchema.statics.updateUser = async function(_id, newData) {
    try {
        const user = await this.findOne({ _id })

        // Mise à jour des champs avec les nouvelles données
        if (newData.email) {
            if (!validator.isEmail(newData.email)) {
                throw new Error('Invalid email');
            }
            user.email = newData.email;
        }

        // Vérifier si newData.password est fourni avant de le mettre à jour
        if (newData.password !== "") {
            if (!validator.isStrongPassword(newData.password)) {
                throw new Error('Password not strong enough');
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newData.password, salt);
            user.password = hash;
        }

        if (newData.userName) {
            user.userName = newData.userName;
        }

        if (newData.photo) {
            user.photo = newData.photo;
        }

        if (newData.phone) {
            user.phone = newData.phone;
        }

        if (newData.description) {
            user.description = newData.description;
        }

       

        // Enregistrement des modifications dans la base de données
        const updatedUser = await user.save();

        return updatedUser;

    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};


userSchema.statics.addPublicationToUser = async function(_id, publication) {
    const user = await this.findOne({ _id })

    user.publications.push(publication._id);

    await user.save();

    return user
};

userSchema.statics.selectUser = async function(_id) {
    const user = await this.findOne({ _id })

    const user_info = {}
    user_info.userName = user.userName
    user_info.photo = user.photo 
    user_info.phone = user.phone
    user_info.description = user.description 
    user_info.email = user.email


    return user_info
};

// get All Users 

userSchema.statics.getAll = async function(_id ){

    
    // select all friend and all sendsrequest and all friend Request 

    const allfriendRequests = await this.findOne({_id}).select('sendsRequests friends friendRequests')
    let idsToExclude = [allfriendRequests._id];
    

    allfriendRequests.sendsRequests.forEach(id => {
        idsToExclude.push(id);
    });

    allfriendRequests.friends.forEach(id => {
        idsToExclude.push(id);
    });
    allfriendRequests.friendRequests.forEach(id => {
        idsToExclude.push(id);
    });
  
    
    const users = await User.find({ _id: { $nin: idsToExclude } }).select("email userName photo phone description");
    return users
}


// envoyer invitation 

userSchema.statics.envoyerInvitation= async function(idFriend , _id){

    await this.findByIdAndUpdate(idFriend,
        { $addToSet: { friendRequests: _id },
          $inc: { 'notifications.invitation': 1 } 

    });
    await this.findByIdAndUpdate(_id, { $addToSet: { sendsRequests: idFriend } });

    return idFriend
}


// les invitation d'un user 

userSchema.statics.invitations = async function(_id){

    const allfriendRequests = await this.findOne({_id}).select('friendRequests')
    let idsInvitations = [];

    allfriendRequests.friendRequests.forEach(id => {
        idsInvitations.push(id);
    });
    const users = await User.find({ _id: { $in: idsInvitations } }).select("email userName photo phone description");

    return users
}

// liste des amis 

userSchema.statics.getAmis = async function(_id){
    const user = await this.findOne({_id}).select('friends')
    let amis = [user._id] 
    user.friends.forEach(id =>{
        amis.push(id)
    })

    return amis
}


// accept invitation user 

userSchema.statics.acceptInv = async function(_id , idUserAccept){
    // a modifier 
    await this.findByIdAndUpdate( _id, { 
        $pull: { friendRequests: idUserAccept } ,
        $addToSet: { friends: idUserAccept }
    });

    await this.findByIdAndUpdate( idUserAccept,{ 
        $pull: { sendsRequests: _id } , 
        $addToSet: { friends: _id } ,
        $inc: { 'notifications.ami': 1 }
        
    });
  

    return idUserAccept
}

// refus invitation user

userSchema.statics.refusInv = async function ( _id , idUserRefus){
    await this.findByIdAndUpdate( _id, { $pull: { friendRequests: idUserRefus } });
    await this.findByIdAndUpdate( idUserRefus, { $pull: { sendsRequests: _id } });

    return idUserRefus
}

// la listes des amis : 

userSchema.statics.amisUser = async function (_id){

    const allfriend = await this.findOne({_id}).select('friends')
    let idsFriends = [];

    allfriend.friends.forEach(id => {
        idsFriends.push(id);
    });

    const users = await User.find({ _id: { $in: idsFriends } }).select("email userName photo phone description");
    return users
}

// delete friend 

userSchema.statics.supprimerAmi =async function (_id , idAmi){
    await this.findByIdAndUpdate( _id, { $pull: { friends: idAmi } });
    await this.findByIdAndUpdate( idAmi, { $pull: { friends: _id } });
    return idAmi
}

userSchema.statics.verifyExistEmail =async function (email){

    const user =  await this.findOne({ email })

    if(user){
        return true
    }

    return false
}

userSchema.statics.updatePassword =async function(email , password){
    const user = await this.findOne({email})
    if(user){
        if(password){
            if (!validator.isStrongPassword(password)) {
                throw new Error('Password not strong enough');
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.password = hash;

            const updatedUser = await user.save();
            return true
        }else{
            return false
        }

    }else{
        return false
    }
   
}

userSchema.statics.consult = async function (_id , type){

    if(type === "ami"){
         await this.findByIdAndUpdate( _id, { 
            $set: { 'notifications.ami': 0 }
        });

    }

    if(type === "invitation"){
        await this.findByIdAndUpdate( _id, { 
            $set: { 'notifications.invitation': 0 }
        })
    }

    return await this.findOne({_id})



}

export const User = mongoose.model('User' , userSchema);

  