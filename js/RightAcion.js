const routeDIV = document.getElementById('route_def');
const routeBTN = document.getElementById('routeBtn');

routeBTN.addEventListener("click", ()=> {

    if (routeDIV.style.display ==  "block") {
        routeDIV.style.display = "none"
    } else {
        routeDIV.style.display = "block"
    }
}, false);

