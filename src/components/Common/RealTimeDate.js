import { useEffect } from "react";

export function useRealTimeToLocalStorage() {
    useEffect(() => {
        let intervalId;

        const fetchTime = async () => {
            try {
                const res = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata");
                if (!res.ok) throw new Error("Failed to fetch time");
                const data = await res.json();

                // Construct initial time
                const initialTime = new Date(
                    `${data.year}-${String(data.month).padStart(2, "0")}-${String(data.day).padStart(2, "0")}T${String(data.hour).padStart(2, "0")}:${String(data.minute).padStart(2, "0")}:${String(data.seconds).padStart(2, "0")}`
                );

                // Save initial time to localStorage
                localStorage.setItem("realTime", initialTime.toISOString());

                // Update every second
                intervalId = setInterval(() => {
                    const currentTimeString = localStorage.getItem("realTime");
                    if (!currentTimeString) return;

                    const currentTime = new Date(currentTimeString);
                    const newTime = new Date(currentTime.getTime() + 1000);
                    localStorage.setItem("realTime", newTime.toISOString());
                }, 1000);
            } catch (err) {
                console.error("Error fetching real-time:", err);
                localStorage.setItem("realTimeError", "Unable to fetch real time. Please check internet.");
            }
        };

        fetchTime();

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);
}
