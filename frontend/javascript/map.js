import { getBicimadStations, getEMTStops } from "/frontend/javascript/api.js";
import { getBikeIcons, getListItems } from "/frontend/javascript/utils.js";

// Sección correspondiente a la creación del mapa.
let map = L.map('map').setView([40.416775, -3.703790], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let stationLayers = L.layerGroup().addTo(map);


// Elemento que recibe la información digitada por el usuario.
let searchQuery =  "";
document.getElementById("search").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    loadBicimadStations();
})

// Elemento que recibe el color relacionado con disponibilidad.
let activeIconFilter = "all";
document.querySelectorAll('input[name="bici-filter"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
        activeIconFilter = e.target.value;
        loadBicimadStations();
    })
})


/**
 * Maneja la respuesta dada por el API de la EMT y los filtros asociados a
 * búsqueda y colores.
 */
async function loadBicimadStations(){
    stationLayers.clearLayers();

    let apiStations = await getBicimadStations();
    let ulElement = document.getElementById("sidebar-list");
    let biciFilter = document.querySelector(".station-bicis");
    biciFilter.classList.add('active');

    let stationMarkers = {};
    ulElement.innerHTML = "";
    
    
    apiStations.forEach(station => {
        let iconRespone = getBikeIcons(station.dock_bikes, station.total_bases);
        let color = iconRespone['icon-color'];

        let colorFilter = (activeIconFilter==="all" || color === activeIconFilter);
        let searchFilter = station.name.toLowerCase().includes(searchQuery);

        if (colorFilter && searchFilter) {
            let lon = station.geometry.coordinates[0];
            let lat = station.geometry.coordinates[1];

            let myMarker = L.marker([lat, lon], {icon:iconRespone["icon-shape"]})
            .addTo(map)
            .bindPopup(
                `
                <p><b>Estación:</b> ${station.name}</p>
                <p><b>Bicis disponibles:</b> ${station.dock_bikes}</p>
                <p><b>Anclajes disponibles:</b> ${station.free_bases}</p>
                <p><b>Hora de actualización:</b>  ${new Date().toLocaleTimeString()}</p>
                `
            )
            .addTo(stationLayers);

            stationMarkers[station.id] = myMarker;

            getListItems(station, ulElement, stationMarkers, map);
        }
    });
}

document.querySelectorAll(".tab-button").forEach(button =>{
    button.addEventListener("click", () =>{
        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        let selectedTab = button.dataset.tab;
        updateSidebarForTab(selectedTab);
    });
});


async function loadEMTStops() {
    stationLayers.clearLayers();

    let emtStops = await getEMTStops();
    let biciFilter = document.querySelector(".station-bicis");
    biciFilter.classList.remove('active');

    let personIcon = L.divIcon({
            className: "custom-bike-icon",
            html: `<i class="fa-solid fa-person"; style="color:red; font-size:20px;"></i>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        })
    
    map.setView([40.41521, -3.69191], 16);

    emtStops.forEach(stop =>{
        let lon = stop.geometry.coordinates[0];
        let lat = stop.geometry.coordinates[1];

        L.marker([lat, lon])
        .addTo(map)
        .bindPopup(
                `
                <p><b>Parada:</b> ${stop.stopName}</p>
                <p><b>Ubicación:</b> ${stop.address}</p>
                <p><b>Distancia a ti:</b> ${stop.metersToPoint}m</p>
                <p><b>Hora de actualización:</b>  ${new Date().toLocaleTimeString()}</p>
                `
            )
        L.marker([40.41521, -3.69191], {icon:personIcon})
        .addTo(map)
        .addTo(stationLayers)

    })
}


let bicimadInterval = null;

function updateSidebarForTab(tab) {
    let titleElement = document.getElementById("sidebar-title");
    let listElement = document.getElementById("sidebar-list");

    listElement.innerHTML = "";
    stationLayers.clearLayers();
    

    if (bicimadInterval){
        clearInterval(bicimadInterval);
        bicimadInterval = null;
    }

    if (tab === "bicimad") {
        titleElement.textContent =  "🚲 🚲 🚲 🚲";
        loadBicimadStations();
        bicimadInterval = setInterval(loadBicimadStations, 30000);
    } else if (tab === "emt") {
        titleElement.textContent = "🚌 🚌 🚌 🚌";
        loadEMTStops();
    }
}