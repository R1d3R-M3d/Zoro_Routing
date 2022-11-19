const routeDIV = document.getElementById('route_def');
const routeBTN = document.getElementById('routeBtn');

routeBTN.addEventListener("click", ()=> {
    if (routeDIV.style.display ==  "block") {
        routeDIV.style.display = "none"
    } else {
        routeDIV.style.display = "block"
    }
}, false);

const GetLocationBTN = document.getElementById('get_location');

GetLocationBTN.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

}, false)

function expandImage(imgs) {
    // Get the expanded image
    var expandImg = document.getElementById("expandedImg");
    // Get the image text
    var imgText = document.getElementById("imgtext");
    // Use the same src in the expanded image as the image being clicked on from the grid
    expandImg.src = imgs.src;
    // Use the value of the alt attribute of the clickable image as text inside the expanded image
    imgText.innerHTML = imgs.alt;
    // Show the container element (hidden with CSS)
    expandImg.parentElement.style.display = "block";
} 

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude);
}