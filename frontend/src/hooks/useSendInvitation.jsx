import { useState } from "react";
import { useUsersContext } from "./useUsersContext";
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from "./useAuthContext";

export const useSendInvitation = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = useUsersContext()

    const { dispatch: authDispatch } = useAuthContext();
    const {user} = useAuthContext()

    const sendInvi = async(id) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch( API_BACKEND + "/api/user/sendinvitaion/" + id, {
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
             dispatch({type : 'SEND_INVITATION' , payload : json.id})
             setIsLoading(false)


        }
    }

    return {sendInvi , isLoading , error}
}