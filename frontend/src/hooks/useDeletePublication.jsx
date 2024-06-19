import { useState } from "react";
import { usePublicationsContext } from "./usePublicationsContext";
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from "./useAuthContext";

export const useDeletePublication = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = usePublicationsContext()

    const { dispatch: authDispatch } = useAuthContext();

    const {user} = useAuthContext()

    const deletePub = async(id) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch( API_BACKEND + "/api/publication/" + id, {
            headers :{"Authorization" : `Bearer ${user.token}`},
            method : 'DELETE' , 
        })

        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok){

             // update the auth context 
             dispatch({type : 'DELETE_PUBLICATION' , payload : json.id})
             setIsLoading(false)


        }
    }

    return {deletePub , isLoading , error}
}