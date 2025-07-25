import { useEffect } from "react";
import { getServerDate } from "../../helpers/backend_helper";

export function useRealTimeToLocalStorage() {
    useEffect(() => {
        let intervalId;



        const fetchTime = async () => {
            try {
                const res = await getServerDate();

                if (!res || !res.Status || !res.ServerDateTime) {
                    throw new Error("Invalid server response");
                }

                const serverTime = new Date(res.ServerDateTime.replace(" ", "T"));
                const basePerf = performance.now();

                // Save base server time and base performance timestamp
                localStorage.setItem("realTimeBase", serverTime.toISOString());
                localStorage.setItem("realTimePerfBase", basePerf.toString());

                clearInterval(intervalId); // Avoid duplicate intervals

                intervalId = setInterval(() => {
                    const baseTimeStr = localStorage.getItem("realTimeBase");
                    const basePerfStr = localStorage.getItem("realTimePerfBase");

                    if (!baseTimeStr || !basePerfStr) return;

                    const baseTime = new Date(baseTimeStr);
                    const basePerf = parseFloat(basePerfStr);
                    const nowPerf = performance.now();

                    const elapsed = nowPerf - basePerf; // time since fetch in ms
                    const currentTime = new Date(baseTime.getTime() + elapsed);

                    localStorage.setItem("realTime", currentTime.toISOString());
                }, 1000);
            } catch (err) {
                console.error("Error fetching real-time:", err);

                // Fallback to system time if server time fails
                const fallbackTime = new Date();
                const basePerf = performance.now();

                localStorage.setItem("realTimeBase", fallbackTime.toISOString());
                localStorage.setItem("realTimePerfBase", basePerf.toString());
                localStorage.setItem("realTimeError", "Unable to fetch real time. Using system time.");

                clearInterval(intervalId);

                intervalId = setInterval(() => {
                    const baseTimeStr = localStorage.getItem("realTimeBase");
                    const basePerfStr = localStorage.getItem("realTimePerfBase");

                    if (!baseTimeStr || !basePerfStr) return;

                    const baseTime = new Date(baseTimeStr);
                    const basePerf = parseFloat(basePerfStr);
                    const nowPerf = performance.now();

                    const elapsed = nowPerf - basePerf;
                    const currentTime = new Date(baseTime.getTime() + elapsed);

                    localStorage.setItem("realTime", currentTime.toISOString());
                }, 1000);
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
