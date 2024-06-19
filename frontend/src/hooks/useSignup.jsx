import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_BACKEND } from "../Api/api";
import { useNavigate } from "react-router-dom";

export const useSignup = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = useAuthContext()
    const navigate = useNavigate();

    const signup = async(email , password , userName , phone , photo) =>{
        setIsLoading(true)
        setError(null)

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userName', userName);
        formData.append('phone', phone);
        formData.append('photo', photo);


        const response =await fetch( API_BACKEND+ '/api/user/signup', {
            method : 'POST' , 
            // headers : {"Content-type" : 'application/json'},
            body: formData

        })

        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)

        }

        if(response.ok){
             //save the user to local storage 
            //  localStorage.setItem('user' , JSON.stringify(json))

            //  // update the auth context 
            //  dispatch({type : 'LOGIN' , payload : json})
             setIsLoading(false)

             navigate('/login');


        }
    }

    return {signup , isLoading , error}
}