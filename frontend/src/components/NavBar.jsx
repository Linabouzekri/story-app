
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

import { useAuthContext } from '../hooks/useAuthContext';
import { API_BACKEND } from '../Api/api';


const NavBar = () => {
  const {logout} = useLogout()
  const {user} = useAuthContext()

  const handleClick = ()=> {  
    console.log("logout");
    logout()

  }

    // State to manage the navbar's visibility
        
    const [nav, setNav] = useState(false);

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

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



  return (
    <div className='bg-black flex justify-between items-center h-24 px-4 text-white w-full'>
  {/* Logo */}
  {/* {user && <h1 className='w-full text-3xl font-bold text-[#00df9a]'>{user.email}</h1>} */}
  <div>
      { user && <div className="flex items-center">
      <Link to={"/profile"}> <img className="w-10 h-10 rounded-full mr-2" src={API_BACKEND +'/Images/' + user.photo} alt="" /></Link>
         
          <div>{user.userName}</div>
      </div>}
  </div>
 
  


  {/* Desktop Navigation */}
  <ul className='hidden md:flex'>
    {!user && 
      navGuest.map(item => (
        <Link   key={item.id} to={item.path}>
          <li
          
            className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
          >
            {item.text}
            
          </li>
        </Link>
      ))
    }

    {user && 

      <> {
        
        navUser.map(item => (
          <Link key={item.id} to={item.path}>
            <li
              
              className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
            >
            {item.text}
              
            </li>
          </Link>
        )) 
      }

        <li key={4}
        className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
        >
        <button onClick={handleClick}>LOGOUT</button>
      </li>
      </>

    }

  

    
  </ul>

  {/* Mobile Navigation Icon */}
  <div onClick={handleNav} className='block md:hidden'>
    {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
  </div>

  {/* Mobile Navigation Menu */}
  <ul
   className={
    nav
      ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50' 
      : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
  }
  >
    {/* Mobile Logo */}
    

    {/* Mobile Navigation Items */}


    {!user &&  
    
    navGuest.map(item => (
      <Link  key={item.id} to={item.path}>
        <li
         
          className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
        >
          <button>{item.text}</button>
        </li>
      </Link>
    ))
    
    }

    {user && 

    <> {
   
        navUser.map(item => (
          <Link  key={item.id} to={item.path}>
            <li
             
              className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
            >
              <button>{item.text}</button>
              
            </li>
          </Link>
        )) 
      }

        <li key={4}
        className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
        >
        <button onClick={handleClick}>LOGOUT</button>
      </li>
    </>

    }


   
  </ul>

   
</div>

  );
}

export default NavBar