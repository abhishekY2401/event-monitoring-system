import axios from "axios";

const API_URL = "http://127.0.0.1:8000/webhook/events";

export const fetchEvents = async () => {
    try {
        const response = await axios.get(API_URL)
        console.log(response)
        if (response.status != 200) {
            throw new Error(`Error: ${response.statusText}`)
        }

        return response.data;
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}