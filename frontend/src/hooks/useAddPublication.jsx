import { useState } from "react";
import { usePublicationsContext } from "./usePublicationsContext";
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from "./useAuthContext";

export const useAddPublication = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = usePublicationsContext()

    const { dispatch: authDispatch } = useAuthContext();

    const {user} = useAuthContext()

    const addPublication = async(description , photo) =>{
        setIsLoading(true)
        setError(null)

        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('description', description);


        const response =await fetch( API_BACKEND +'/api/publication/add', {
            method : 'POST' , 
            headers :{"Authorization" : `Bearer ${user.token}`},
            body: formData
        })

        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok){

             // update the auth context 
             dispatch({type : 'CREATE_PUBLICATIONS' , payload : json.publication})
             setIsLoading(false)

            //  localStorage.setItem('user' , JSON.stringify(json.user))
            //  // update the auth context 
            //  authDispatch({type : 'LOGIN' , payload : json.user})

        }
    }

    return {addPublication , isLoading , error}
}