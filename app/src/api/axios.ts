import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/sip/api/public",
    headers: {
        "Content-Type": "application/json",
    },
});
