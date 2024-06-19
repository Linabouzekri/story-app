import { mongoose } from "mongoose";


const Schema = mongoose.Schema

const verificationMailSchema = new Schema({
 
    email : {
        type : String , 
        required : true, 
        unique : true , 
    },
    code : {
        type : String , 
        required : true,
    },


})


verificationMailSchema.statics.store = async function(email , code){
    const exite = await this.findOne({email})

    if(exite){ 
        exite.code = code
        await exite.save()
        
        return exite       
    }

    const verificaton = this.create({
        email , 
        code
    })

    return verificaton
}

verificationMailSchema.statics.verify = async function(email , code){
    const validation = await this.findOne({email})

    if(validation === null){
        throw Error("Email n'existe pas ")
    }

    if(email === validation.email && code === validation.code){
        return true
    }else{
        return false
    }

}


export const verificationMail = mongoose.model('VerificationMail' , verificationMailSchema);



