
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { requestServer } from "./js/pixabay-api";
import { updateGallery, showLoader, hideLoader } from './js/render-functions';


const form = document.querySelector('.form');
form.addEventListener('submit', onSubmit);


export function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const { searchText } = form.elements;
    const correctValueText = searchText.value.trim();

    if (!correctValueText) {
        iziToast.show({
            title: "⛔",
            message: 'Please write a search query!',
            color: 'yellow',
            position: "topRight"
        });
        return;
    }

    showLoader();

    requestServer(correctValueText)
        .then(hits => {

            if (!Array.isArray(hits)) {
                console.error("Invalid response structure. Hits is not an array.");
                iziToast.show({
                    title: "⚠️",
                    message: 'Unexpected response format. Please try again later!',
                    color: 'red',
                    position: "topRight"
                });
                hideLoader();
                return;
            }


            if (hits.length === 0) {
                iziToast.show({
                    title: "❌",
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    color: 'red',
                    position: "topRight"
                });
                hideLoader();
                return;
            }

            updateGallery(hits);
            form.reset();
        })
        .catch(error => {
            console.error("Error:", error.message);
        })
        .finally(() => {
            hideLoader();
        });
}

