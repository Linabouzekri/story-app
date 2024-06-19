import { useState } from "react";
import { useUsersContext } from "./useUsersContext";
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from "./useAuthContext";

export const useRefusInvitation = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = useUsersContext()

    const { dispatch: authDispatch } = useAuthContext();
    const {user} = useAuthContext()

    const refusInv = async(id) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch( API_BACKEND + "/api/user/invitation/refus/" + id, {
            headers :{"Authorization" : `Bearer ${user.token}`},
            method : 'PUT' , 
        })

        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok){
             // update the auth context 
             dispatch({type : 'REFUS_INVITATION' , payload : json.id})
             setIsLoading(false)


        }
    }

    return {refusInv , isLoading , error}
}