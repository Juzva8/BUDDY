let searchButton = document.querySelector("#search")

searchButton.addEventListener("click", () => {
    console.log("response")
})

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