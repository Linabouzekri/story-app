import React, { useState  , useRef} from 'react';
import { useSignup } from "../hooks/useSignup";


import { API_BACKEND, API_FRONTEND } from '../Api/api';

const Register = () => {

    const [isModalValidation , setIsModalValidation] = useState(false)
    const [code , setCode] = useState('')

    const [errorCode , setErrorCode] = useState("")
   

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName , setUserName] = useState('')
    const [phone , setPhone] = useState('')
    const [photo, setPhoto] = useState(null);
    const [previewImage, setPreviewImage] = useState( API_FRONTEND +'/src/Images/avatar.jpg');

    const picREf = useRef()

    const {signup , isLoading , error} = useSignup()


    const handleCodeChange = (e)=>{
        setCode(e.target.value)
    }
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

    const handlePhotoChange = (e)=>{
        const selectedPhoto = e.target.files[0]
        setPhoto(selectedPhoto)
        setPreviewImage(URL.createObjectURL(selectedPhoto));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(email, password);
        setErrorCode("")

        setIsModalValidation(true)

        const data = {
            "email" : email
        }

        const response =await fetch( API_BACKEND+ '/api/user/storeverification', {
            method : 'POST' , 
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify(data)

        })


        
    }

    const handelValidationMail = async (e)=>{
        e.preventDefault()

        //verifier email  

        const data = {
            "email" : email , 
            "code" : code
        }

        const response =await fetch( API_BACKEND+ '/api/user/verifymail', {
            method : 'POST' , 
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify(data)

        })
        const json = await response.json()

        if(json){
            await signup(email , password , userName , phone , photo)
            setIsModalValidation(false)
            setErrorCode("")
        }else{
            setErrorCode("code incorrect")
        }
      


       
    }

    const clickImage=()=>{
        picREf.current.click();
        
     }

    const toggleModalValidation = ()=>{
        setIsModalValidation(!isModalValidation)
    }
    

    return (
        <>
        <div className="register flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md px-4">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                {error && <div className='error text-center text-red-500'>{error}</div>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data" >

                        <div className="mb-5 flex justify-center items-center">
                            <input ref={picREf} type="file" id="image" accept="image/*" onChange={handlePhotoChange}  hidden/>
                            <img onClick={clickImage} src={previewImage} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg"   />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UserName</label>
                            <input type="test" id="userName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                     required 
                                onChange={handleUserNameChange}
                                value={userName}
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                            <input type="text" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                     required 
                                onChange={handlePhoneChange}
                                value={phone}
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="exemple@exemple.com" required 
                                onChange={handleEmailChange}
                                value={email}
                            />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                             onChange={handlePasswordChange}
                             value={password}
                            
                            />
                        </div>
                       
                        <button disabled ={isLoading} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
                      
                    </form>
                </div>
            </div>
        </div>

        {isModalValidation && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-xl max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Validation Mail 
                                </h3>
                                <button onClick={toggleModalValidation} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorCode && <div className='text-red-500 text-center'>{errorCode}</div> }
                            <form onSubmit={handelValidationMail}  className="p-4 md:p-5"  >
                                <div className="mb-5">
                                    <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">code</label>
                                    <input type="text" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            required 
                                        onChange={handleCodeChange}
                                        value={code}
                                    />
                                </div>
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Valide
                                </button>

                            </form>
                        </div>
                    </div>
                )}

    </>
    )
}

export default Register