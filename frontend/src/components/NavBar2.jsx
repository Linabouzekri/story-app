import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

import { useAuthContext } from '../hooks/useAuthContext';
import { API_BACKEND } from '../Api/api';

const NavBar2 = () => {

    const {logout} = useLogout()
    const {user , dispatch} = useAuthContext()
  
    const handleClick = ()=> {  
      console.log("logout");
      setlisteProfile(false)
      logout()
  
    }
  
      // State to manage the navbar's visibility
          
      const [nav, setNav] = useState(false);
      const [listeProfil , setlisteProfile] =useState(false)
  
      // Toggle function to handle the navbar's display
      const handleNav = () => {
          setNav(!nav);
      };

      const toggleProfile = ()=>{
        setlisteProfile(!listeProfil)
      }
  
      // Array containing navigation items
      const navGuest = [
          { id: 2, text: 'LOGIN' , path : "/login" },
          { id: 3, text: 'REGISTER' , path : "/register" },
          
      ];
  
      const navUser = [
        { id: 5, text: 'HOME' , path : "/" },
        { id: 6, text: 'USERS' , path : "/users" },
        { id: 7, text: 'INVITATION' , path : "/invitation" },
        { id: 8, text: 'AMIS' , path : "/amis" },
    ];


    // consultation  

    const consulte = async(type)=>{
        console.log(type);
        const data = {

            "type" : type ,
         }

        const response =await fetch( API_BACKEND+ '/api/user/consult', {
            method : 'PUT' , 
            headers : {
                "Content-type" : 'application/json' ,
                "Authorization" : `Bearer ${user.token}`
            },
            body: JSON.stringify(data)

        })
        const json = await response.json()
        console.log(json);

        const user_up = {
            "email": user.email,
            "phone": user.phone,
            "photo": user.photo,
            "userName": user.userName,
            "description": user.description,
            "notifications": json,
            "token": user.token
        }

        dispatch({type : 'LOGIN' , payload : user_up})
        localStorage.setItem('user' , JSON.stringify(user_up))
        
    }
  

    
  return (
   <>
   <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            
                <button onClick={handleNav} type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                
                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
               
                <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                        {!user && 
                                navGuest.map(item => (
                                    <Link   key={item.id} to={item.path}>
                                        <button  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"> {item.text}</button>
                                    </Link>
                                ))
                        }
                     {user &&
        
                        navUser.map(item => (
                            <div key={item.id}>
                                {((item.text === "INVITATION" && user.notifications.invitation !== 0) || (item.text === "AMIS" &&  user.notifications.ami !== 0 ) ) ?
                                    <Link  to={item.path}>
                                    {item.text === "INVITATION" &&
                                        <button onClick={()=>{consulte('invitation')}}  className="relative text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"> 
                                            {item.text} 
                                            <div  className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
                                            
                                                {/* {item.text === "AMIS" && user.notifications.ami} */}
                                                {user.notifications.invitation}
                                            </div>
                                        </button>

                                    }

                                    {item.text === "AMIS" &&
                                        <button  onClick={()=>{consulte('ami')}} className="relative text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"> 
                                            {item.text} 
                                            <div  className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
                                            
                                                {/* {item.text === "AMIS" && user.notifications.ami} */}
                                                {user.notifications.ami}
                                            </div>
                                        </button>

                                    }
                                  
                                    </Link>

                                    :
                                    <Link  to={item.path}>
                                    <button  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"> 
                                    {item.text} 
                                    </button>
                                    </Link>

                                }
                               
                            </div>
                        
                        )) 
                    }
                    </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
               {user && 
                    <button onClick={toggleProfile}  className='text-white'   > {user.userName}</button>
               }

        
                <div className="relative ml-3">
                <div>
                    {user && 
                    <button  onClick={toggleProfile} type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    {/* <span className="sr-only">Open user menu</span> */}
                    <img  className="h-8 w-8 rounded-full" src={API_BACKEND +'/Images/' + user.photo} alt="" />
                    </button>
                    }
                </div>

                    {listeProfil && 
                            <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                <Link onClick={toggleProfile} to={"/profile"}><button  className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0">Your Profile</button></Link>
                                <button onClick={handleClick}  className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</button>
                            </div>
                    }
                   
                </div>
            </div>
            </div>
        </div>


        <div className="sm:hidden" id="mobile-menu">
            {nav && 
                <div className="space-y-1 px-2 pb-3 pt-2">
                
                {!user && 
                                    navGuest.map(item => (
                                        <Link   key={item.id} to={item.path}>
                                        <button onClick={handleNav}  className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"> {item.text}</button>
                                        </Link>
                                    ))
                            }
                        {user &&
            
            navUser.map(item => (
                <div key={item.id}>
                    {((item.text === "INVITATION" && user.notifications.invitation !== 0) || (item.text === "AMIS" &&  user.notifications.ami !== 0 ) ) ?
                        <Link  to={item.path}>
                        {item.text === "INVITATION" &&
                            <button onClick={()=>{consulte('invitation')}}  className="relative text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"> 
                                {item.text} 
                                <div  className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
                                
                                    {/* {item.text === "AMIS" && user.notifications.ami} */}
                                    {user.notifications.invitation}
                                </div>
                            </button>

                        }

                        {item.text === "AMIS" &&
                            <button  onClick={()=>{consulte('ami')}} className="relative text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"> 
                                {item.text} 
                                <div  className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
                                
                                    {/* {item.text === "AMIS" && user.notifications.ami} */}
                                    {user.notifications.ami}
                                </div>
                            </button>

                        }
                      
                        </Link>

                        :
                        <Link  to={item.path}>
                        <button  className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"> 
                        {item.text} 
                        </button>
                        </Link>

                    }
                   
                </div>
            
            )) 
                        }
            
                </div>
            }
        </div>
</nav>

{/*  <button onClick={handleNav}  className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"> {item.text}</button>
                             */}

   </>
  )
}

export default NavBar2