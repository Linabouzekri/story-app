
import { UsersContext } from "../context/UserContext";
import { useContext } from "react";

export const useUsersContext = () =>{
    const context = useContext(UsersContext)
    
    if (!context){
        throw Error('useContext must be used inside an UsersContextProvider')
    }
    
    return context
}