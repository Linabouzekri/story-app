import React, { useState } from 'react'
import { API_BACKEND } from '../Api/api'
import { useSendInvitation } from '../hooks/useSendInvitation'
import { useAcceptInvitation } from '../hooks/useAcceptInvitation'
import { useRefusInvitation } from '../hooks/useRefusInvitation'
import { Link } from 'react-router-dom'
import { useProfileContext } from '../hooks/useProfileContext'
import { AiFillDelete } from "react-icons/ai";
import { useDeleteAmi } from '../hooks/useDeleteAmi'

const CardUser = ({utilisateur , type}) => {

    const {sendInvi , isLoading , error} = useSendInvitation()
    const {acceptInv , isLoading  : isLoadingAcceptInv, error : errorAcceptInv} = useAcceptInvitation()
    const  {refusInv , isLoading : isLoadingRefusInvitation, errorRefusInvitation} = useRefusInvitation()
    const {deleteFriend }= useDeleteAmi()
    const {profile_id , dispatch} = useProfileContext()

   

    const handlUser =()=>{
      dispatch({type : 'SET_PROFILE' , payload : utilisateur._id})
    }

    const sendInvitation = (id)=>{
        sendInvi(id)
    }
    // accept invitation 
    const acceptInvitation = (id) =>{
      acceptInv(id)
    }

    // refus invitation 
    const refusInvitation = (id)=>{
      refusInv(id)
    }

    // supprimer invitation 
    const supprimerInvitation =(id)=>{
      deleteFriend(id)
    }

  return (
    <>
             <div  className="w-full max-w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    {type === "amis" && 
                          <div className="flex justify-end px-4 pt-4">
                              <button className='text-red-500' ><AiFillDelete onClick={()=>{supprimerInvitation(utilisateur._id)}}  className='size-7'/></button>
                          </div>
                    }
                   

                    <div className="flex flex-col items-center pb-10 mt-5">

                        <Link onClick={handlUser} to={"/profileUser/"} >
                            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={API_BACKEND + '/Images/' + utilisateur.photo} alt="Bonnie image"/>
                        </Link>
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{utilisateur.userName}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{utilisateur.email}</span>
                        {type === "users" &&
                         <div className="flex mt-4 md:mt-6">
                         <button onClick={()=>{sendInvitation(utilisateur._id)}} type="button" className="inline-flex items-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 ">Add friend</button>
                         </div>
                        }

                        {type === "invitation" && 

                          <div className="flex mt-4 md:mt-6">
                            
                            <button onClick={()=>{acceptInvitation(utilisateur._id)}} type="button" className="inline-flex items-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 ">Accept</button>

                            <button onClick={()=>{refusInvitation(utilisateur._id)}} type="button" className=" ml-3 inline-flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Refus</button>
                           </div>
                        }
                       
                    </div>
             </div>
    </>
  )
}

export default CardUser