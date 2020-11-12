let searchButton = document.querySelector("#search")


searchButton.addEventListener("click", () => {
    sendApisRequest()
})


async function sendApisRequest() {
    let APP_ID = "bc65a9c5"
    let API_KEY = "152ffcca6d5b1af41df34fc359228af2"
    let searchTerm = $("#searchText").val();
    console.log(searchTerm);
    let response = await fetch(`https://api.edamam.com/search?app_id=${APP_ID}&app_key=${API_KEY}&q=${searchTerm}`);
    let data = await response.json();
    console.log(data);
    useApiData(data);
}

function useApiData(data) {
    for (let i = 0; i < 1; i++) {
        let calories = data.hits[i].recipe.calories.toFixed(0)
        $("#content").append(`<div class= "card col-4 offset-1" style = "width: 18rem;">
            <img src = "${data.hits[i].recipe.image}" class = "card-img-top" alt = "...">        
            <div class = "card-body">
            <h5 class = "card-title"> ${data.hits[i].recipe.label} </h5> 
            <p class="card-text">${calories}cal</p>
        <a href = "${data.hits[i].recipe.url}" class="btn btn-primary"> get full recipe </a> </div > </div>`)
        console.log(i);
    }
}