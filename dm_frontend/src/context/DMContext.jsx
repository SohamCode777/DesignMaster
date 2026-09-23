import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";



export const DMContext = createContext();

const DMContextProvider = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const setCurrentUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
                { withCredentials: true }
            );

            console.log(response.data);

            if (!response.data.user) {
                setUser(null);
            } else {
                setUser(response.data.user);
            }

        } catch (error) {
            console.log(error.response?.data);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };




    useEffect(()=>{
        setCurrentUser();
    },[]);





    const value ={isLoggedIn, setIsLoggedIn, user, setUser, setCurrentUser,loading,setLoading};

    return(
        <DMContext.Provider value={value}>
            {props.children}
        </DMContext.Provider>
    )
}


export default DMContextProvider;