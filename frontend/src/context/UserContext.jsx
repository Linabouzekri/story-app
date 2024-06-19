import { createContext  , useReducer , useEffect } from "react";

export const UsersContext = createContext() 

export const usersReducer = (state , action) =>{
    switch(action.type){
        case 'SET_USERS' :
            return {users : action.payload}

        case 'SEND_INVITATION':
            const filtereUsers = state.users.filter(item => item._id !== action.payload);
            return {users: filtereUsers };

        case 'ACCEPT_INVITATION':
            const filtereUsers1 = state.users.filter(item => item._id !== action.payload);
            return {users: filtereUsers1 };

        case 'REFUS_INVITATION':
            const filtereUsers2 = state.users.filter(item => item._id !== action.payload);
            return {users: filtereUsers2 };
        
        case 'DELETE_AMI':
        const filtereUsers3 = state.users.filter(item => item._id !== action.payload);
        return {users: filtereUsers3 };
        default : 
            return state 

    }
}

export const UsersContextProvider = ({children})=>{
    const [state  , dispatch] = useReducer(usersReducer , {
       users :  null
    })

    //dispatch({type:"SET_PUBLICATIONS" , payload : [{} , { }]})

    return(
        <UsersContext.Provider value={{...state , dispatch}}>
            {children}
        </UsersContext.Provider>
    )
}

