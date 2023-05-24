import React, { useEffect, useState } from 'react';


let count1 = 0
let count2 = 0
let count3 = 0
let count4 = 0
let count5 = 0
let count6 = 0
let count7 = 0


let intervalId

const SessionAlive = ({ history }) => {

   

    useEffect(() => {

        console.log("inside useEffect", count2)//________________________
        ++count2                             //________________________

        let timer

        const hasNoActivity = () => {

            console.log(" hasNoActivity", count3) //________________________
            ++count3                               //________________________
    
            clearInterval(intervalId);
            clearInterval(timer);
            sessionStorage.clear()
            history.push({ pathname: '/login' })
        }

        const startTimer = () => {

            console.log(" startTimer", count4) //________________________
            ++count4                              //________________________

            timer = setInterval(hasNoActivity, 0.5 * 60 * 1000);
        };

        const resetTimer = () => {
            console.log(" resetTimer", count5) //________________________
            ++count5
            clearInterval(timer);
            startTimer();
        };

        let hasActivity = sessionStorage.getItem('lastActivityTime', new Date().getTime())
        !hasActivity && keepSessionAlive()

        startTimer();

        window.addEventListener('keydown', resetTimer);
        // window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);


        return () => {
            console.log(" return", count6) //________________________
            ++count6
            clearInterval(timer);
            document.removeEventListener('keydown', resetTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
        };
    }, []);

    return null
};


const updateTokan = () => {
    // axios.get('https://api.example.com/keepalive');
}

const keepSessionAlive = () => {
    console.log(" keepSessionAlive", count7) //________________________
            ++count7
    sessionStorage.setItem('keepSessionAlive', new Date().getTime())
    intervalId = setInterval(updateTokan, 0.2 * 60 * 1000)
};

// export default SessionAlive;
