import { createContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

// Decode a JWT's payload (no extra library needed) to read its expiry time
const getTokenExpiry = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload?.exp ? payload.exp * 1000 : null; // convert to ms
    } catch (error) {
        return null;
    }
};

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logoutTimerRef = useRef(null);

    const scheduleAutoLogout = (token) => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }

        const expiryTime = getTokenExpiry(token);
        if (!expiryTime) return;

        const timeLeft = expiryTime - Date.now();

        // Token already expired (e.g. tab was closed and reopened after 1 day)
        if (timeLeft <= 0) {
            clearUser();
            window.location.href = '/login';
            return;
        }

        // Auto-logout exactly when the token expires, even without user interaction
        logoutTimerRef.current = setTimeout(() => {
            clearUser();
            window.location.href = '/login';
        }, timeLeft);
    };

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        scheduleAutoLogout(accessToken);

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(
                    API_PATHS.AUTH.GET_PROFILE
                );
                setUser(response.data);
            } catch (error) {
                console.error("user not authenticated", error);
                clearUser()
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        return () => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, [])

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        scheduleAutoLogout(userData.token);
        setLoading(false);
    }

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
            {children}
        </UserContext.Provider>
    )

}

export default UserProvider
