'use client'

import { createContext, useContext, useEffect, useState } from "react"

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    const  [userInfo, setUserInfo] = useState(null)

    const handleUserInfo = (data, rememberDevice) => {
        setUserInfo(data)
        const expiryTime = rememberDevice ? null : new Date().getTime() + 24 * 60 * 60 * 1000;
        const userData = {
            data: data,
            expiry: expiryTime,
        }
        if (typeof window !== "undefined") {
            localStorage.setItem('app.AUTH', JSON.stringify(userData))
        }
    }

    const deleteUserInfo = () => {
        setUserInfo(null)
        if (typeof window !== "undefined") {
            localStorage.removeItem('app.AUTH')
        }
    }



    useEffect(()=> {
        if (typeof window !== "undefined") {
            const storedUserStr = localStorage.getItem('app.AUTH')
            if (storedUserStr) {
                const storedUser = JSON.parse(storedUserStr);
                if (storedUser.expiry && new Date().getTime() > storedUser.expiry) {
                    deleteUserInfo()
                } else {
                    setUserInfo(storedUser.data);
                }
            }
        }
    },[])
    
    useEffect(() => {

        if (typeof window !== "undefined") {
            const storedUserStr = localStorage.getItem('app.AUTH')
            if(storedUserStr){
                const storedUser = JSON.parse(storedUserStr)
                const checkServerUpdates = async() => {
                    try {
                        const response = await fetch(`/api/sesion/login?email=${storedUser.data.email}`, {
                            method: "GET",
                            headers: {
                            "Content-Type": "application/json"
                            }
                        })
                        const data = await response.json()
                        if(data){
                            const updatedUserData = {
                                data: data.user,
                                expiry: storedUser.expiry 
                            }
                            localStorage.setItem('app.AUTH', JSON.stringify(updatedUserData))
                            setUserInfo(data.user)
                        }
                    } catch (error) {
                        console.error('Error fetching user info:', error)
                    }
                }
                const intervalId = setInterval(checkServerUpdates, 60000)
                return () => clearInterval(intervalId)
            }
            
        }
        
    }, [])

    return(
        <UserContext.Provider value = {{userInfo, handleUserInfo, deleteUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () =>  useContext(UserContext)