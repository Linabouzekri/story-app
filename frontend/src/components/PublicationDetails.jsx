import React, { useRef, useState } from 'react'
import { API_BACKEND, API_FRONTEND } from '../Api/api'
import { Link } from 'react-router-dom'
import { useProfileContext } from '../hooks/useProfileContext'

import { MdAddPhotoAlternate, MdDelete } from "react-icons/md";
import { useAuthContext } from '../hooks/useAuthContext';
import { usePublicationsContext } from '../hooks/usePublicationsContext';
import { TiDelete } from 'react-icons/ti';
import { MdEdit } from "react-icons/md";

import { useUpdatePublication } from '../hooks/useUpdatePublication';
import { useDeletePublication } from '../hooks/useDeletePublication';

const PublicationDetails = ({publication , transaction}) => {
    const {user} = useAuthContext()
    const {publications , dispatch : dispatchPublication} = usePublicationsContext()

    const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
    const [isModalOpenUpdatePublication , setIsModalOpenUpdatePublication] =useState(false)

    const {profile_id , dispatch} = useProfileContext()

    const picREfPublication = useRef()

    // update publication
    const [previewImagePublication, setPreviewImagePublication] = useState( "");
    const [photoPublication, setPhotoPublication] = useState(null);
    const [addImage , setAddImage] = useState(false)
    const [descriptionPublication , setDescriptionPublication ] = useState("");
    const [idUpdatePublication , setIdUpdatePublication] = useState(null)
    const {updatePub , isLoading , error} = useUpdatePublication()

    // delete publication 
    const [idPublicationDelete , setIdPublicationDelete] = useState(null) 
    //const [errorDelete , setErrorDelete] = useState("")

    const {deletePub , isLoading : isLoadingDelete , error : errorDelete} = useDeletePublication()

    const handlUser = ()=>{
        dispatch({type : 'SET_PROFILE' , payload : publication.user._id})
    }
    const deletePublication = (id)=>{
        setIsModalDeleteOpen(true)
        setIdPublicationDelete(id)
    }


    const updatePublication = (id) =>{
        setDescriptionPublication(publication.description)
        setIdUpdatePublication(id)

        if(publication.photo){
            setPreviewImagePublication( API_BACKEND + '/Images/' + publication.photo)   
            setAddImage(true)    
        }

        setIsModalOpenUpdatePublication(true)
    }

    const toggleModalDelete = ()=>{
        setIsModalDeleteOpen(!isModalDeleteOpen)
    }

    const toggleModalUpdatePublication = ()=>{
        setIsModalOpenUpdatePublication(!isModalOpenUpdatePublication)
    }


    const handlePhotoChangePublication = (e)=>{
        const selectedPhoto = e.target.files[0]
        setPhotoPublication(selectedPhoto)
        setPreviewImagePublication(URL.createObjectURL(selectedPhoto));
        setAddImage(true)
    }


  

   

    const clickImagePublication=()=>{
        picREfPublication.current.click();
        
    }

    const supprimerPhotoPublication = () => {
        setAddImage(false);
    };

    const handleDescriptionPublicationChange =(e)=>{
        setDescriptionPublication(e.target.value);
        
    }

    // update publication 
    const handleSubmitUpdatePublication =async(e)=>{
        e.preventDefault();
        console.log(idUpdatePublication);
        await updatePub(descriptionPublication , photoPublication ,idUpdatePublication)
        setDescriptionPublication("")
        setPhotoPublication(null)
        setIdUpdatePublication(null)
        setIsModalOpenUpdatePublication(false)
    }

    // detlete Publication 

    const handleDeletePublicationSubmit = async (e)=>{
        e.preventDefault();
        deletePub(idPublicationDelete) 
        setIsModalDeleteOpen(false)
        setIdPublicationDelete(null) 
            
        // a modifier 

        // const response = await fetch( API_BACKEND + "/api/publication/" + idPublicationDelete, {
        //     headers :{"Authorization" : `Bearer ${user.token}`},
        //     method : 'DELETE' , 
        // })

        // if(response.ok){
        //     const newPublications = await publications.filter(item=> item._id !== idPublicationDelete)

        //     dispatchPublication({type : 'SET_PUBLICATIONS' , payload : newPublications})
        //     setIsModalDeleteOpen(false)
        //     setIdPublicationDelete(null) 
        //     setErrorDelete("")
            
        // }
       
    }
  return (
    <>
    <article className="flex flex-col shadow my-4 w-full">
    {/* Photo de profil */}
    <div className="flex items-center justify-between bg-white p-4">
        <div className="flex items-center">
            {/* Affichage de la photo de profil */}
            {publication.user && publication.user.photo && (
                <Link onClick={handlUser} to={"/profileUser/"} >
                
                <img
                    src={API_BACKEND + '/Images/' + publication.user.photo}
                    alt="Photo de profil"
                    className="w-12 h-12 rounded-full mr-4"
                />
                </Link>
            )}

           
            {/* Affichage du nom d'utilisateur */}
            {publication.user && (
                <h2 className="text-lg font-semibold">{publication.user.userName}</h2>
            )}
        </div>

        {transaction && <div className='flex'>
                            <MdDelete onClick={()=> {deletePublication(publication._id)}}  className='size-7 text-red-500 '  />  
                            <MdEdit onClick={()=>{updatePublication(publication._id)}}  className='size-7 text-blue-600' />
                        </div>}
        {/* Placeholder pour la date de publication ou d'autres informations */}
        {/* Ajoutez ici les détails supplémentaires que vous souhaitez afficher à côté du nom d'utilisateur */}
    </div>
    <div className="bg-white flex flex-col justify-start p-6 w-full">
        <p className="w-full">{publication.description}</p>
    </div>
    
    {/* Article Image */}

    <div className="hover:opacity-75">
    {publication.photo && (
        <img
            src={API_BACKEND + '/Images/' + publication.photo}
            alt="Photo de l'article"
            className="w-full object-cover "
        />
    )}
  </div>  

   
</article>


{isModalDeleteOpen &&

        <div id="deleteModal" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
            <div className="relative p-4 w-full max-w-md">
                <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button onClick={toggleModalDelete} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    { errorDelete && <div className='text-red-700'>{errorDelete}</div>}
                    <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
                    <div className="flex justify-center items-center space-x-4">
                        <button onClick={toggleModalDelete} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                            No, cancel
                        </button>
                        <button onClick={handleDeletePublicationSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            Yes, I'm sure
                        </button>
                    </div>
                </div>
            </div>
        </div>

}


{isModalOpenUpdatePublication && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Modifier Publication 
                                </h3>
                                <button onClick={toggleModalUpdatePublication} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="p-4 md:p-5"  onSubmit={handleSubmitUpdatePublication} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                

                                    <div className="col-span-2 sm:col-span-1">
                                    <input ref={picREfPublication} type="file" id="image" accept="image/*" onChange={handlePhotoChangePublication}  hidden/>
                                    {addImage && <>
                                        <img  onClick={clickImagePublication} src={previewImagePublication}  alt="Preview" className="hover:opacity-75"   />
                                        <button type='button' onClick={supprimerPhotoPublication}> <TiDelete /></button>
                                    </>
                                    }
                                    
                                    {!addImage && <button type='button' onClick={clickImagePublication}> <MdAddPhotoAlternate /></button>}

                                    
                                </div>

                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <textarea  value={descriptionPublication} id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Quoi de Neuf" onChange={handleDescriptionPublicationChange}></textarea>                    
                                    </div>  
                                  
                                </div>
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Modifier Publication
                                </button>

                            </form>
                        </div>
                    </div>
                )}
</>
  )
}

export default PublicationDetails