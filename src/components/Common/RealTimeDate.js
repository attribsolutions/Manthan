import { useEffect } from "react";

export function useRealTimeToLocalStorage() {
    useEffect(() => {
        let intervalId;



        const fetchTime = async () => {
            try {
                const res = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata");
                if (!res.ok) throw new Error("Failed to fetch time");
                const data = await res.json();

                // Build accurate initial date object
                const initialTime = new Date(
                    `${data.year}-${String(data.month).padStart(2, "0")}-${String(data.day).padStart(2, "0")}T${String(data.hour).padStart(2, "0")}:${String(data.minute).padStart(2, "0")}:${String(data.seconds).padStart(2, "0")}`
                );

                // Save base time and base timestamp (ms) in localStorage
                localStorage.setItem("realTimeBase", initialTime.toISOString());
                localStorage.setItem("realTimeBaseMs", Date.now().toString());

                clearInterval(intervalId); // prevent duplicates

                intervalId = setInterval(() => {
                    const baseTimeStr = localStorage.getItem("realTimeBase");
                    const baseMsStr = localStorage.getItem("realTimeBaseMs");

                    if (!baseTimeStr || !baseMsStr) return;

                    const baseTime = new Date(baseTimeStr);
                    const baseMs = parseInt(baseMsStr);

                    const now = Date.now();
                    const diff = now - baseMs;

                    const currentTime = new Date(baseTime.getTime() + diff);
                    localStorage.setItem("realTime", currentTime.toISOString());
                }, 1000);
            } catch (err) {
                console.error("Error fetching real-time:", err);

                // fallback: use device time
                const fallbackTime = new Date();
                localStorage.setItem("realTimeBase", fallbackTime.toISOString());
                localStorage.setItem("realTimeBaseMs", Date.now().toString());

                intervalId = setInterval(() => {
                    const baseTimeStr = localStorage.getItem("realTimeBase");
                    const baseMsStr = localStorage.getItem("realTimeBaseMs");

                    if (!baseTimeStr || !baseMsStr) return;

                    const baseTime = new Date(baseTimeStr);
                    const baseMs = parseInt(baseMsStr);

                    const now = Date.now();
                    const diff = now - baseMs;

                    const currentTime = new Date(baseTime.getTime() + diff);
                    localStorage.setItem("realTime", currentTime.toISOString());
                }, 1000);

                localStorage.setItem("realTimeError", "Unable to fetch real time. Using system time.");
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
