import { PublicationsContext } from "../context/PublicationContext";
import { useContext } from "react";

export const usePublicationsContext = ()=>{
    const context = useContext(PublicationsContext)
    
    if (!context){
        throw Error('useContext must be used inside an PublicationsProvider')
    }
    
    return context
}