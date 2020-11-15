// document.addEventListener("DOMContentLoaded", function() {

// var appId = "bc65a9c5";
// var appKey = "152ffcca6d5b1af41df34fc359228af2";
// });
let searchButton = document.querySelector("#search")


searchButton.addEventListener("click", () => {
    console.log("button pressed")
        // sendApisRequest()
})

// function forecast(searchTerm) {
//     var queryURL = "https://api.edamam.com/search?app_id=${appId}&app_key=${appKey}&q=pizza"
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then(function(response) {
//         for (var i = 0; i < response.list.length; i++)


async function sendApisRequest() {
    let APP_ID = "bc65a9c5"
    let API_KEY = "152ffcca6d5b1af41df34fc359228af2"
    let response = await fetch("https://api.edamam.com/search?app_id=${APP_ID}&app_key=${API_KEY}&q=pizza");
    console.log(response)
    let data = await response.json()
    console.log(data)
    useApiData(data)
}

function useApiData(data) {
    document.querySelector("#content").innerHTML = ` <
    div class = "card col-4 offset-1"
    style = "width: 18rem;" >
        <
        img src = "${data.hits[0].recipe.image}"
    class = "card-img-top"
    alt = "..." >
        <
        div class = "card-body" >
        <
        h5 class = "card-title" > ${hits[0].recipe.label} < /h5> <
    p class = "card-text" > ${data.hits[0].recipe.calories}'.</p> <
    a href = "${data.hits[0].recipe.url}"
    class = "btn btn-primary" > Go somewhere < /a> < /
    div > <
        /div>
`

}
// }