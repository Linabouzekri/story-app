import { useState } from "react";
import { useUsersContext } from "./useUsersContext";
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from "./useAuthContext";

export const useDeleteAmi = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = useUsersContext()

    const { dispatch: authDispatch } = useAuthContext();
    const {user} = useAuthContext()

    const deleteFriend = async(id) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch( API_BACKEND + "/api/user/amis/" + id, {
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
             dispatch({type : 'DELETE_AMI' , payload : json.id})
             setIsLoading(false)


        }
    }

    return {deleteFriend , isLoading , error}
}