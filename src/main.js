
import iziToast from "izitoast";

import { markupPhoto } from "./js/render-functions";
import { requestServer } from "./js/pixabay-api";


const form = document.querySelector('.form');
const loader = document.querySelector('.loader');
form.addEventListener('submit', onSubmit);

export function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    
    const { searchText } = form.elements;
    console.log(searchText.value);
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

     loader.classList.remove("hidden");

    requestServer(correctValueText)
        .then(hits => {
        
            if (hits.length === 0) {
                iziToast.show({
                title: "❌",
                message: 'Sorry, there are no images matching your search query. Please try again!',
                color: 'red',
                position: "topRight"
            });  
                loader.classList.add("hidden");
                return;
            }
            
            markupPhoto(hits);
            form.reset();
        })
        .catch(error => {
            console.error("Error:", error.message);
            iziToast.show({
                title: "⚠️",
                message: 'An unexpected error occurred. Please try again later!',
                color: 'blue',
                position: "topRight"
            });
        })
        .finally(() => {
            loader.classList.add("hidden");
        });
}

