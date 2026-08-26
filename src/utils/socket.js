import { io } from 'socket.io-client';
import { BASE_URL } from './apiPaths';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        const token = localStorage.getItem('token');
        socket = io(BASE_URL, {
            auth: { token },
            autoConnect: false,
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

