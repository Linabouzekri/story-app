import React, { useEffect, useState } from 'react'
import { useProfileContext } from '../hooks/useProfileContext';
import { API_BACKEND } from "../Api/api";
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from "react-router-dom";
import PublicationDetails from '../components/PublicationDetails';

const ProfileUserDetails = () => {
  const {user} = useAuthContext()
  const navigate = useNavigate();
  const [publications , setPublication ] = useState(null)
  const [profileUser , setProfileUser ] = useState(null)
 
  const {profile_id } = useProfileContext()


  useEffect(()=>{
    const fetchPublication = async ()=>{
        const response = await fetch(API_BACKEND +'/api/publication/profile/details/'+profile_id , {
            headers :{"Authorization" : `Bearer ${user.token}`}
        })

        const json = await response.json()

        if(json.profile_user){
          navigate('/profile')
        }

       

        if(response.ok){
          setPublication(json.publications)
          setProfileUser(json.user)
        }

    }

    fetchPublication()

} , [])



  return (
    <>
    {profileUser &&  
      <>      
     <div>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mx-auto max-w-242.5">
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark relative"> {/* Ajout de relative ici */}
                    <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                        <img className='' src={API_BACKEND +'/Images/' + profileUser.photo} alt="profile" />
                       
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-medium text-black dark:text-white">
                        {profileUser.userName}
                        </h3>
                        <p className="font-medium">{profileUser.email}</p>
                        <p className="font-medium">{profileUser.phone}</p>
                        {profileUser.description && 
                        <div className="mx-auto max-w-180">
                            <h4 className="font-medium text-black dark:text-white">
                            About Me
                            </h4>
                            <p className="mt-4.5 text-sm font-normal">
                            {profileUser.description}
                            </p>
                        </div>
                        }
                        
                    </div>
                    </div>
                </div>
                </div>

                {publications   && 
                  <section className="w-full md:w-2/3 flex flex-col items-center px-3">
               

                        {publications && publications.map((publication)=>(
                            <PublicationDetails key={publication._id} publication= {publication} />
                        ))}
                
        
                        {/* Pagination */}
                        <div className="flex items-center py-8">
                            <a href="#" className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center">1</a>
                            <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center">2</a>
                            <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3">Next <i className="fas fa-arrow-right ml-2"></i></a>
                        </div>
        
                  </section>

                }

        
            </div>

        </div>


      </>
    }
     
    </>
  )
}

export default ProfileUserDetails