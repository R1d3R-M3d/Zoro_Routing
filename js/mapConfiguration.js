function addGeojsonFeatureFunc(feature, layer) {
    layer.bindPopup("<b>"+feature.properties.name+"</b>");
}

function addGeojsonFeatureFuncOpened(feature, layer) {
    layer.bindPopup("<b>"+feature.properties.name+"</b>", {autoClose:false}).openPopup();
}

/**
* Map Atributes
*/
var mapAtr = "";

/**
* Layer from the Database
*/
var campusIFC = new L.featureGroup();

/**
 *  Layer for the Rooms in the First Floor
 */
var roomsFloor1 = new L.featureGroup();

/**
 *  Layer for the Rooms in the Second Floor
 */
 var roomsFloor2 = new L.featureGroup();

/**
 * Layer for the routes
 */
var routesIFC = new L.featureGroup();

/**
* Osm Tile
*/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

/** 
* Google Satelite
*/
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 19,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: '© Google'
});

/**
* I.F.C. Tile
* Getting the Data From the API postgis_to_geojson.php 
* using JS Async Wait
*/
async function getGeoJSON() {
    try {
        const response = await fetch("./basic_map.php");
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

getGeoJSON().then(data => {
    //Add the GeoJSON as a Layer Map Using Leaflet, Filtering the Data and Aplying Diferent Styles
    L.geoJSON([data],{
        filter: function(feature, layer) {
            return (feature.properties.type === "street");
        }
    }).addTo(campusIFC);

    L.geoJSON([data],{
        filter: function(feature, layer) {
            return (feature.properties.type === "corridor");
        }
    }).addTo(campusIFC);

    L.geoJSON([data],{
        filter: function(feature, layer) {
            return (feature.properties.type === "buildings");
        },
        style: {
            color: 'black'
        },
        onEachFeature:addGeojsonFeatureFunc

    }).addTo(campusIFC);

    L.geoJSON([data],{
        filter: function(feature, layer) {
            addGeojsonFeatureFunc;
            return (feature.properties.type === "room, 1 andar");
        },
        style: {
            weight: 1
        },
        onEachFeature:addGeojsonFeatureFunc
        
    }).addTo(roomsFloor1);

    L.geoJSON([data],{
        filter: function(feature, layer) {
            return (feature.properties.type === "room, 2 andar");
        },
        style: {
            weight: 1
        },
        onEachFeature:addGeojsonFeatureFunc

    }).addTo(roomsFloor2);
});

/// ROUTE DEFINITION
const routeDRAW = document.getElementById('routeStartBtn');
// Get the whole form, not the individual input-fields
const route_form = document.getElementById('route_form');

routeDRAW.addEventListener("click", (event)=> {
    //Prevent the event from submitting the form, no redirect or page reload
    event.preventDefault();
    //Clear the layer (the data) before another query is made
    routesIFC.clearLayers();    

    const formattedFormData = new FormData(route_form);

    async function getRouteGeoJSON() {
        try {
            const response = await fetch("./route_search.php",{
            method: 'POST',
            body: formattedFormData
        })

            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }
    
    getRouteGeoJSON().then(data => {
    //Add the GeoJSON as a Layer Map Using Leaflet
        L.geoJSON([data], {
            style: {
                color: 'red',
                dashArray: '2,5',
                lineJoin: 'round'
            }
        }).addTo(routesIFC);
        /*
        L.geoJSON([data], {
            filter: function(feature, layer) {
                return (feature.properties.seq === 1);
            }
        }).addTo(routesIFC);
        */
    });
});

//SEARCH RESOURCES 
const searchBTN = document.getElementById('search_button');

const search_form = document.getElementById('search_form');

searchBTN.addEventListener("click", (event) => {
    //Prevent the event from submitting the form, no redirect or page reload
    event.preventDefault();
    //Clear the layer (the data) before another query is made
    routesIFC.clearLayers();    
    
    const formattedFormData = new FormData(search_form);
    
    async function getGeoJSONresource() {
        try {
            const response = await fetch('./resource_search.php',{
                method: 'POST',
                body: formattedFormData
            });
            
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }

    getGeoJSONresource().then(data => {
        L.geoJSON([data], {
            style: {
                color: 'red',
            },
            onEachFeature: addGeojsonFeatureFuncOpened
        }).addTo(routesIFC);
    });

}, false)


/** 
* Base Layers
*/
var baseMaps = {
    "Google Satelite": googleSat,
    "Open Street Maps": osm
}

/** 
* Overlay Vector Layers
*/
var overlayMaps = {
    "Campus": campusIFC,
    "Salas do Primeiro Andar": roomsFloor1,
    "Salas do Segundo Andar": roomsFloor2,
    "Rotas": routesIFC
}

/**
* Map Configuration
*/
var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [campusIFC, roomsFloor1, osm, googleSat, routesIFC]
}).setView([-27.0157806,-48.6607969], 17); //setView([51.505, -0.09], 13);

/** 
* Layer Control
*/
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);