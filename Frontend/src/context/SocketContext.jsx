import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";

const SocketContext = createContext()

export const useSocket = () => {
    return useContext(SocketContext)
}


export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const user = useRecoilValue(userAtom)

    useEffect(() => {
        if (!user) return; // Only connect if there's a user

        const socket = io('http://localhost:5000', {
            query: {
                userId: user._id
            }
        })

        setSocket(socket)

        // Socket event listeners
        socket.on('connect', () => {
            console.log('Connected to socket server');
        })

        socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error);
        })
        socket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users)
            
        })

        // Cleanup function
        return () => {
            if (socket) {
                socket.disconnect()
            }
        }
    }, [user]) // Only depend on user, not socket
    console.log(onlineUsers, 'Online users')
    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    ) 
}