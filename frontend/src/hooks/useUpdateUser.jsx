import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_BACKEND } from "../Api/api";

export const useUpdateUser = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = useAuthContext()
    const {user} = useAuthContext()

    const updateUser = async(email , password , userName , phone , photo , description) =>{
        setIsLoading(true)
        setError(null)

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userName', userName);
        formData.append('phone', phone);
        formData.append('photo', photo);
        formData.append('description' , description)



        const response =await fetch( API_BACKEND+ '/api/user/profile', {
            method : 'PUT' , 
            headers : {"Authorization" : `Bearer ${user.token}`},
            body: formData

        })



        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)

        }
        
        if(response.ok){
             //save the user to local storage 
             localStorage.setItem('user' , JSON.stringify(json))

             // update the auth context 
             dispatch({type : 'LOGIN' , payload : json})
             setIsLoading(false)


        }

    }

    return {updateUser , isLoading , error}
}