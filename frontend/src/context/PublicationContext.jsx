import { createContext  , useReducer , useEffect } from "react";

export const PublicationsContext = createContext() 

export const  publicationsReducer = (state , action) =>{
    switch(action.type){
        case 'SET_PUBLICATIONS' :
            return { publications : action.payload}
        case 'CREATE_PUBLICATIONS':
            return  {publications : [action.payload , ...state.publications]}
        case 'UPDATE_PUBLICATION':

            const updatedPublicationIndex = state.publications.findIndex(pub => pub._id === action.payload._id);
        
            if (updatedPublicationIndex !== -1) {
                const updatedPublications = [...state.publications];
                updatedPublications[updatedPublicationIndex] = action.payload;
                return { publications: updatedPublications };
            } 
        case 'DELETE_PUBLICATION':
            const filteredPublications = state.publications.filter(pub => pub._id !== action.payload);
            return { publications: filteredPublications };
        default : 
            return state 

    }
}

export const PublicationsContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(publicationsReducer , {
        publications :  null
    })

    //dispatch({type:"SET_PUBLICATIONS" , payload : [{} , { }]})

    return(
        <PublicationsContext.Provider value={{...state , dispatch}}>
            {children}
        </PublicationsContext.Provider>
    )
}

