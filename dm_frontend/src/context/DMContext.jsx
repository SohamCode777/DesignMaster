import { useState } from "react";
import { createContext } from "react";



export const DMContext = createContext();

const DMContextProvider = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const value ={isLoggedIn, setIsLoggedIn};

    return(
        <DMContext.Provider value={value}>
            {props.children}
        </DMContext.Provider>
    )
}


export default DMContextProvider;