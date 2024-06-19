import React, { useEffect, useRef, useState } from 'react'
import { MdAddPhotoAlternate } from "react-icons/md";
import { TiDelete } from "react-icons/ti";

import { usePublicationsContext } from '../hooks/usePublicationsContext';
import { API_BACKEND } from '../Api/api';
import PublicationDetails from '../components/PublicationDetails';
import { Link, json } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useAddPublication } from '../hooks/useAddPublication';
import { useUsersContext } from '../hooks/useUsersContext';
import { useProfileContext } from '../hooks/useProfileContext';


const Home = () => {
    const {users , dispatch : dispatchUsers} = useUsersContext()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description , setDescription ] = useState("");
    const picREf = useRef()
    const [previewImage, setPreviewImage] = useState( "");
    const [photo, setPhoto] = useState(null);
    const [addImage , setAddImage] = useState(false)
    const {publications , dispatch} = usePublicationsContext()
    const {user} = useAuthContext()
    const {addPublication , isLoading , error} =useAddPublication() 

    const {profile_id , dispatch : dispatchProfile} = useProfileContext()

    useEffect(()=>{
        const fetchPublication = async ()=>{
            const response = await fetch(API_BACKEND +'/api/publication' , {
                headers :{"Authorization" : `Bearer ${user.token}`}
            })
            const json = await response.json()

            if(response.ok){
                dispatch({type : 'SET_PUBLICATIONS' , payload : json})
            }

        }

        const fetchusers = async ()=>{
            const response = await fetch(API_BACKEND +'/api/user/amis' , {
                headers :{"Authorization" : `Bearer ${user.token}`}
            })
            const json = await response.json()
    
            if(response.ok){
               dispatchUsers({type : 'SET_USERS' , payload : json})
            }
        }
    
        
        fetchPublication()
        fetchusers()


    } , [])

    // profile amis 
    const handlUser =(id)=>{
        dispatchProfile({type : 'SET_PROFILE' , payload : id})
    }
    // 

    const supprimerPhotoPublication = () => {
        setAddImage(false);
    };

    const handleDescriptionChange =(e)=>{
        setDescription(e.target.value);
       
    }
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handlePhotoChange = (e)=>{
        const selectedPhoto = e.target.files[0]
        setPhoto(selectedPhoto)
        setPreviewImage(URL.createObjectURL(selectedPhoto));
        setAddImage(true)
    }

    
    const clickImage=()=>{
        picREf.current.click();
        
     }

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await addPublication(description , photo)
        setDescription("")
        setPhoto(null)
        setIsModalOpen(false)
        setPreviewImage("")
        setAddImage(false)
    }

  return (
    <>
    
    <div className="container mx-auto flex flex-wrap py-6">

    {/* Posts Section */}
    <section className="w-full md:w-2/3 flex flex-col items-center px-3">
        <div className="w-full bg-white shadow flex flex-col my-4 p-6">
           <button onClick={toggleModal}  className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
                Ajouter publication
            </button>
        </div>

        {publications && publications.map((publication)=>(
            <PublicationDetails key={publication._id} publication= {publication} />
        ))}
 

        {/* Pagination */}
        {/* <div className="flex items-center py-8">
            <a href="#" className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center">1</a>
            <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center">2</a>
            <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3">Next <i className="fas fa-arrow-right ml-2"></i></a>
        </div> */}

    </section>

    {/* Sidebar Section */}
    <aside className="w-full md:w-1/3 flex flex-col items-center px-3">

     

        <div className="w-full bg-white shadow flex flex-col my-4 p-6">
            <p className="text-xl font-semibold pb-5">Amis</p>
            <div className="grid grid-cols-3 gap-3">
            {users && users.slice(0, 9).map((item) => (
               <div key={item._id}  className="w-100 h-100">
                 <Link onClick={()=>{handlUser(item._id)}} to={"/profileUser/"} >
                    <img className="hover:opacity-75 w-24 h-24 mb-3 shadow-lg" src={API_BACKEND + '/Images/' + item.photo} />
                 </Link>
                </div>

            ))}
               
            </div>
            <Link to={'/amis'}  className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-6">
                <i className="fab fa-instagram mr-2"></i> voir plus d'amis
            </Link>
        </div>

    </aside>

</div>

{/* modal add publication  */}

{isModalOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Ajouter Publication 
                                </h3>
                                <button onClick={toggleModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form class="p-4 md:p-5"  onSubmit={handleSubmit} encType="multipart/form-data">
                                <div class="grid gap-4 mb-4 grid-cols-2">
                                

                                    <div className="col-span-2 sm:col-span-1">
                                    <input ref={picREf} type="file" id="image" accept="image/*" onChange={handlePhotoChange}  hidden/>
                                    {addImage && <>
                                        <img  onClick={clickImage} src={previewImage}  alt="Preview" className="hover:opacity-75"   />
                                        <button type='button' onClick={supprimerPhotoPublication}> <TiDelete /></button>
                                    </>
                                    }
                                    
                                    {!addImage && <button type='button' onClick={clickImage}> <MdAddPhotoAlternate /></button>}

                                    
                                </div>

                                    <div class="col-span-2">
                                        <label htmlFor="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <textarea  value={description} id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Quoi de Neuf" onChange={handleDescriptionChange}></textarea>                    
                                    </div>  
                                  
                                </div>
                                <button  type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Ajouter Publication
                                </button>

                            </form>
                        </div>
                    </div>
                )}

</>

  )
}

export default Home