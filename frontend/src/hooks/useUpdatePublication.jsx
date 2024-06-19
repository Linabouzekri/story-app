import { useState } from "react";
import { usePublicationsContext } from "./usePublicationsContext";
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from "./useAuthContext";

export const useUpdatePublication = ()=>{
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] =useState(null)
    const {dispatch} = usePublicationsContext()

    const { dispatch: authDispatch } = useAuthContext();

    const {user} = useAuthContext()

    const updatePub = async(description , photo , id_publication) =>{
        setIsLoading(true)
        setError(null)

        const formData =  new FormData();
        formData.append('photo', photo);
        formData.append('description', description);

        if (!user || !user.token) {
            throw new Error('User or token is not defined');
        }

        console.log(formData.description );


        const response =await fetch( API_BACKEND +'/api/publication/' + id_publication , {
            method : 'PUT' , 
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
             dispatch({type : 'UPDATE_PUBLICATION' , payload : json.publication})
             setIsLoading(false)

        }
    }

    return {updatePub, isLoading , error}
}