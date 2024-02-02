import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { sessionAliveNewToken } from '../../store/auth/sessionAlive/actions';

const SessionContext = createContext();


const SESSION_TIMEOUT_DURATION = 28 * 60 * 1000; // 2 minutes
const REFRESH_TOKEN_INTERVAL = 29 * 60 * 1000; // 1.3 minutes 

export const SessionProvider = ({ history, children }) => {

    const dispatch = useDispatch();

    const [session, setSession] = useState({
        active: ((localStorage.getItem("token")) && (localStorage.getItem("roleId"))) ? true : false,
        // ... other session data
    });

    const updateSessionActivity = (newSession = {}) => {
        setSession((prevSession) => ({
            ...prevSession,
            ...newSession,
        }));
    };


    const sessionEndActivity = ({
        sessionTimeout,
        refreshTokenIntervalId,
        resetSessionTimeout,
    }) => {

        window.removeEventListener('mousemove', resetSessionTimeout);
        window.removeEventListener('keydown', resetSessionTimeout);
        localStorage.clear();
        clearTimeout(sessionTimeout);
        clearInterval(refreshTokenIntervalId);
        updateSessionActivity({ active: false })
    }

    useEffect(() => {
        let sessionTimeout;
        let refreshTokenIntervalId;

        const startSessionTimeout = () => {
            localStorage.setItem("lastActivity", Date.now())
            sessionTimeout = setTimeout(() => {

                if (!isUserActive(SESSION_TIMEOUT_DURATION)) {
                    sessionEndActivity({
                        sessionTimeout,
                        refreshTokenIntervalId,
                        resetSessionTimeout,
                        resetSessionTimeout
                    })

                }
            }, SESSION_TIMEOUT_DURATION);
        };

        const resetSessionTimeout = () => {
            if (session.active === true) {
                clearTimeout(sessionTimeout);
                startSessionTimeout();
            }
        };



        if (session.active === true) {
            window.addEventListener('mousemove', resetSessionTimeout);
            window.addEventListener('keydown', resetSessionTimeout);
            startSessionTimeout();

            if (islastToken()) {
                callRefreshToken(dispatch);
            } else {
                localStorage.setItem("lastRefreshToken", Date.now());
            }

            refreshTokenIntervalId = setInterval(() => {
                callRefreshToken(dispatch);
            }, REFRESH_TOKEN_INTERVAL);
        }

        return () => {
            clearTimeout(sessionTimeout);
            clearInterval(refreshTokenIntervalId);
            window.removeEventListener('mousemove', resetSessionTimeout);
            window.removeEventListener('keydown', resetSessionTimeout);
        };
    }, [session.active]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if ((event.key === 'roleId')) {
                if (!(event.oldValue === event.newValue)) {

                    history.push({ pathname: "/Dashboard" })
                    window.location.reload(true)
                }

            } else if (!(event.key === "i18next.I18N_LANGUAGE")
                && !(event.key === "i18next.translate.boo")
                && (event.newValue === null)) {
                window.location.reload(true)
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <SessionContext.Provider value={{ session, updateSessionActivity }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

const isUserActive = (SESSION_TIMEOUT_DURATION) => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - localStorage.getItem("lastActivity");
    return timeElapsed < SESSION_TIMEOUT_DURATION;
};
const islastToken = () => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - localStorage.getItem("lastRefreshToken");
    return timeElapsed < REFRESH_TOKEN_INTERVAL;
};

const callRefreshToken = (dispatch) => {

    let istoken = localStorage.getItem("refreshToken")
    if (istoken) {
        localStorage.setItem("lastRefreshToken", Date.now());
        let jsonBody = { "refresh": `${istoken}` }
        dispatch(sessionAliveNewToken(jsonBody))
    }
};