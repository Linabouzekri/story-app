import React, { useEffect, useState } from 'react';

import {useLogin} from '../hooks/useLogin'
import { API_BACKEND } from '../Api/api';

const Login = () => {
    const [email, setEmail] = useState((''));
    const [password, setPassword] = useState('');
    const {login , isLoading , error} = useLogin()

    const [rememberMe , setRemeberMe] = useState(true)

    // forget password
    const [isForgetModal , setIsForgetModal] = useState(false)
    const [emailForgot , setEmailForgot] = useState('')
    const [codeForgot , setCodeForgot] = useState('')
    const [newPasswordForgot , setNewPasswordForgot] = useState('')
    const [verifyEmailForm , setVerifyEmailForm] = useState(false)
    const [verifyCodeForm , setVerifyCodeForm] = useState(false)
    const [verifyNewPasswordForm , setVerifyNewPasswordForm] = useState(false)
    const [errorForgetPassword , setErrorForgetPassword ] = useState('')
    
    useEffect (()=>{
        const emailLocal = localStorage.getItem('email');
        const passwordLocal = localStorage.getItem('password') 
        if(emailLocal , passwordLocal){
            setEmail(emailLocal)
            setPassword(passwordLocal)
        }
        
    }, [])

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const changeNewPasswordForgot = (e)=>{
        setNewPasswordForgot(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email , password)

        if(rememberMe){
            localStorage.setItem("email", email);
            localStorage.setItem("password" , password)
        }else{
            localStorage.setItem("email", "");
            localStorage.setItem("password" , "")
        }
    }


    // remember me : 

    const rememberMeChange = (e)=>{
        setRemeberMe(e.target.checked);
    }

    // forgot password
    const toggleModalForgot = ()=>{
        setIsForgetModal(false)
    }

   

    const changeEmailForgot = (e)=>{
        setEmailForgot(e.target.value)
    }

    const changeCodeForgot = (e)=>{
        setCodeForgot(e.target.value)
    }
  
    const handleForgetModel = ()=>{
        setIsForgetModal(true)
        setVerifyEmailForm(true)
        setVerifyCodeForm(false)
        setVerifyNewPasswordForm(false)
        setErrorForgetPassword("")
    }

    // send formulaire forget 
    const handleForgotPassword = async (e)=>{
        e.preventDefault()

        // verifier si email existe et envoyer email vers utilisateur 
        const response =await fetch( API_BACKEND +'/api/user/forgetpassword/veryexistMail', {
            method : 'POST' , 
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify({ email : emailForgot})

        })

        const json = await response.json()

       if(response.ok){

            if(json){
                setVerifyEmailForm(false)
                setVerifyCodeForm(true)
                setErrorForgetPassword("")
            }else{
                setErrorForgetPassword("email Incorrect")
            }

       }else{
        setErrorForgetPassword(json.erro)
       }

        
    }

    const handleForgotCode = async (e)=>{
        e.preventDefault()

        const response =await fetch( API_BACKEND +'/api/user/verifymail', {
            method : 'POST' , 
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify({ email : emailForgot , code : codeForgot})

        })

        const json = await response.json()

       if(response.ok){

            if(json){
                setVerifyCodeForm(false)
                setVerifyNewPasswordForm(true)
            }else{
                setErrorForgetPassword("code Incorrect")
            }

       }else{
        setErrorForgetPassword(json.erro)
       }

    

    }

    const handleForgotNewPassword = async(e)=>{
        e.preventDefault()

        const response =await fetch( API_BACKEND +'/api/user/forgetpassword', {
            method : 'PUT' , 
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify({ email : emailForgot , password : newPasswordForgot})

        })

        const json = await response.json()

        if(response.ok){
 
             if(json){
                 setIsForgetModal(false)
             }else{
                 setErrorForgetPassword("error Password ")
             }
 
        }else{
         setErrorForgetPassword(json.erro)
        }
      
    }
    






    return (
      <>
        <div className="login flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md px-4">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                {error && <div className='error text-center text-red-500'>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="exxemple@exemple.com" required 
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
                        <div className="flex items-start mb-5">
                            <div className="flex items-center h-5">
                                <input onChange={rememberMeChange} id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" checked={rememberMe} />
                            </div>
                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                            
                        </div>
                        <div className='mb-2 '>
                            <a onClick={handleForgetModel}  className="text-sm text-blue-700 dark:text-blue-400 hover:underline">Forgot Password?</a>
                        </div>
                        <button disabled ={isLoading} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                       
                    </form>
                </div>
            </div>
        </div>

        {isForgetModal && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-xl max-h-screen bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Validation Mail 
                                </h3>
                                <button onClick={toggleModalForgot} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div >
                            {errorForgetPassword &&
                                <div className='text-red-500 text-center' >
                                    {errorForgetPassword}
                                </div>
                            }
                            
                            {verifyEmailForm && 
                                <form onSubmit={handleForgotPassword}  className="p-4 md:p-5"  >
                                    <div className="mb-5">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                required 
                                            onChange={changeEmailForgot}
                                            value={emailForgot}
                                        />
                                    </div>
                                    <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Verifier
                                    </button>

                                </form>
                            }

                            {verifyCodeForm && 
                                <form onSubmit={handleForgotCode}  className="p-4 md:p-5"  >
                                    <div className="mb-5">
                                        <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
                                        <input type="text" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                required 
                                            onChange={changeCodeForgot}
                                            value={codeForgot}
                                        />
                                    </div>
                                    <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Verifier Code
                                    </button>

                                </form>
                            }

                            
                            {verifyNewPasswordForm && 
                                <form onSubmit={handleForgotNewPassword}  className="p-4 md:p-5"  >
                                    <div className="mb-5">
                                        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nouveau Password</label>
                                        <input type="text" id="newPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                required 
                                            onChange={changeNewPasswordForgot}
                                            value={newPasswordForgot}
                                        />
                                    </div>
                                    <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        change Mot de passe
                                    </button>

                                </form>
                            }

                           
                        </div>
                    </div>
                )}


      </>
    );
}

export default Login;
