import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext';
import { API_BACKEND, API_FRONTEND } from '../Api/api';
import { FaEdit } from "react-icons/fa";
import { useUpdateUser } from '../hooks/useUpdateUser';
import { usePublicationsContext } from '../hooks/usePublicationsContext';
import PublicationDetails from '../components/PublicationDetails';
// import icons
import { MdAddPhotoAlternate } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { useAddPublication } from '../hooks/useAddPublication';

const Profile = () => {
    const {user} = useAuthContext()

    const {publications , dispatch} = usePublicationsContext()

    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [userName , setUserName] = useState(user.userName)
    const [phone , setPhone] = useState(user.phone)
    const [photo, setPhoto] = useState(user.photo);
    const [photoPublication, setPhotoPublication] = useState(user.photo);
    const [description , setDescription ] = useState(user.description);
    const [descriptionPublication , setDescriptionPublication ] = useState("");
    const [previewImage, setPreviewImage] = useState( API_BACKEND +'/Images/' +photo);
    const [previewImagePublication, setPreviewImagePublication] = useState( "");
    const [addImage , setAddImage] = useState(false)

    const {updateUser , isLoading , error} = useUpdateUser()
    const {addPublication , isLoading:isLoadingPublication, error:errorPublication} =useAddPublication() 

    
    // modal 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPublication, setIsModalOpenPublication] = useState(false);

    const picREf = useRef()
    const picREfPublication = useRef()

    const supprimerPhotoPublication = () => {
        setAddImage(false);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

   
    const toggleModalPublication = () => {
        setIsModalOpenPublication(!isModalOpenPublication);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleUserNameChange =(e)=>{
        setUserName(e.target.value);
    }

    const handlePhoneChange =(e)=>{
        setPhone(e.target.value);
       
    }

    
    const handleDescriptionChange =(e)=>{
        setDescription(e.target.value);
       
    }

    const handleDescriptionPublicationChange =(e)=>{
        setDescriptionPublication(e.target.value);
       
    }


    const handlePhotoChange = (e)=>{
        const selectedPhoto = e.target.files[0]
        setPhoto(selectedPhoto)
        setPreviewImage(URL.createObjectURL(selectedPhoto));
    }

    const handlePhotoChangePublication = (e)=>{
        const selectedPhoto = e.target.files[0]
        setPhotoPublication(selectedPhoto)
        setPreviewImagePublication(URL.createObjectURL(selectedPhoto));
        setAddImage(true)
    }



    
    const clickImage=()=>{
        picREf.current.click();
        
     }
    
     const clickImagePublication=()=>{
        picREfPublication.current.click();
        
     }


    

     const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email , password , userName , phone , photo , description);
        await updateUser(email , password , userName , phone , photo , description)
        setIsModalOpen(false)

        
    }

    const handleSubmitPublication = async (e) => {
        e.preventDefault();
        await addPublication(descriptionPublication , photoPublication)
        setDescriptionPublication("")
        setPhotoPublication(null)
        setIsModalOpenPublication(false)
        setPreviewImagePublication("")
        setAddImage(false)
    }

    useEffect(()=>{
        const fetchPublication = async ()=>{
            const response = await fetch(API_BACKEND +'/api/publication/profile' , {
                headers :{"Authorization" : `Bearer ${user.token}`}
            })
            const json = await response.json()

            if(response.ok){
                dispatch({type : 'SET_PUBLICATIONS' , payload : json})
            }

        }

        fetchPublication()

    } , [])


  
  return (
    <>
   

        <div>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mx-auto max-w-242.5">
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark relative"> 
                    <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                        <img className='' src={API_BACKEND +'/Images/' + user.photo} alt="profile" />
                       
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-medium text-black dark:text-white">
                        {user.userName}
                        </h3>
                        <p className="font-medium">{user.email}</p>
                        <p className="font-medium">{user.phone}</p>
                        {user.description && 
                        <div className="mx-auto max-w-180">
                            <h4 className="font-medium text-black dark:text-white">
                            About Me
                            </h4>
                            <p className="mt-4.5 text-sm font-normal">
                            {user.description}
                            </p>
                        </div>
                        }
                        <button onClick={toggleModal}  type='button'  > 
                            <FaEdit />
                        </button>
                    </div>
                    </div>
                </div>
                </div>

                <section className="w-full md:w-2/3 flex flex-col items-center px-3">
                <div className="w-full bg-white shadow flex flex-col my-4 p-6">
                <button  onClick={toggleModalPublication}  className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
                        Ajouter publication
                    </button>
                </div>

                {publications && publications.map((publication)=>(
                    <PublicationDetails key={publication._id} publication= {publication} transaction={true} />
                ))}
        

                {/* Pagination */}
                {/* <div className="flex items-center py-8">
                    <a href="#" className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center">1</a>
                    <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center">2</a>
                    <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3">Next <i className="fas fa-arrow-right ml-2"></i></a>
                </div> */}

        </section>
            </div>

        </div>

       


            {isModalOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Update Profile
                                </h3>
                                <button onClick={toggleModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="p-4 md:p-5" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">

                                <div className="col-span-2 sm:col-span-1">
                                    <input ref={picREf} type="file" id="image" accept="image/*" onChange={handlePhotoChange}  hidden/>
                                    <img onClick={clickImage} src={previewImage} alt="Preview" className="cursor-pointer w-20 h-20 object-cover rounded-full border border-gray-300 hover:border-blue-500"   />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UserName</label>
                                        <input type="text" name="userName" id="userName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"     onChange={handleUserNameChange}
                                         value={userName} /> 
                                   
                                </div>

                                  

                                    <div className="col-span-2">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  placeholder="exemple@exemple.com"   onChange={handleEmailChange}
                                            value={email} />  
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                                        <input type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"     onChange={handlePhoneChange}
                                            value={phone} />  
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"     onChange={handlePasswordChange}
                                            value={password} />  
                                    </div>


                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <textarea  value={description} id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write product description here" onChange={handleDescriptionChange}></textarea>                    
                                    </div>
                                </div>
                                <button disabled ={isLoading} type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Modifier
                                </button>

                                {error && <div className='error'>{error}</div>}
                            </form>
                        </div>
                    </div>
                )}
            
            {isModalOpenPublication && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Ajouter Publication 
                                </h3>
                                <button onClick={toggleModalPublication} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="p-4 md:p-5"  onSubmit={handleSubmitPublication} encType="multipart/form-data">
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
                                     Ajouter Publication
                                </button>

                            </form>
                        </div>
                    </div>
                )}
    </>
);

}

export default Profile