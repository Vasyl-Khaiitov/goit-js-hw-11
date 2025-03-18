
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

import axios from "axios";
import { markupPhoto } from "./render-functions";

const API_KEY = (axios.defaults.API_KEY = '49359087-343ead2b9467da8fb57304bcb');
const BASE_URL = (axios.defaults.baseURL = 'https://pixabay.com/api/');




export function requestServer(query) {

    if (!query.trim()) {
        console.error("Search query is empty!");
        return Promise.reject("Search query is empty.");
    }


    const options = {
        params: {
            key: API_KEY,
            q: query.trim(),
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
        },
    };

    return axios
        .get(BASE_URL, options)
        .then(response => {
            const hits = response?.data?.hits;
    
            if (!Array.isArray(hits)) {
                console.error("Invalid response structure. Hits is not an array.");
                iziToast.show({
                    title: "⚠️",
                    message: 'Unexpected response format. Please try again later!',
                    color: 'red',
                    position: "topRight"
                });
                return;
            }

            if (hits.length === 0) {
                iziToast.show({
                    title: "❌",
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    color: 'red',
                    position: "topRight"
                });
                return;
            }
            markupPhoto(hits);
            return hits;
        })
        .catch(error => {
            console.error("API Error:", error.message);

            let errorMessage = 'An unexpected error occurred. Please try again later!';
            if (error.response) {
                errorMessage = `Server Error: ${error.response.data.message || error.message}`;
            } else if (error.request) {
                errorMessage = 'Network Error: Failed to reach the server. Please check your internet connection.';
            }

            iziToast.show({
                title: "⚠️",
                message: errorMessage,
                color: 'red',
                position: "topRight"
            });
        });

}


