import axios from "axios";

const LATEST_EVENTS_API_URL = import.meta.env.VITE_LATEST_EVENTS_API_URL;
const ALL_EVENTS_API_URL = import.meta.env.VITE_ALL_EVENTS_API_URL;


export const fetchLatestEvents = async (latestTimestamp) => {
    try {
        // const utcTimestamp = latestTimestamp ? moment(latestTimestamp).utc().toISOString() : '';
        const response = await axios.get(LATEST_EVENTS_API_URL, {
            params: {
                latest_timestamp: latestTimestamp || "",
            }
        });
        // console.log(response)
        if (response.status != 200) {
            throw new Error(`Error: ${response.statusText}`)
        }

        return response.data;
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}

export const fetchAllEvents = async () => {
    try {
        console.log(ALL_EVENTS_API_URL)
        const response = await axios.get(ALL_EVENTS_API_URL);
        

        if (response.status != 200) {
            throw new Error(`Error: ${response.statusText}`)
        }

        return response.data;
    } catch (error) {
        console.error("Failed to fetch all events:", error);
        return [];
    }
}