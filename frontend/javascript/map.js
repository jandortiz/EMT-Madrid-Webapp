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

    let apiStations = await getStations();
    let ulElement = document.getElementById("station-list");
    let stationMarkers = {};

    ulElement.innerHTML = "";
    stationLayers.clearLayers();
    
    
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

        if (selectedTab === 'bicimad') {
            showBicimadLayer();
            hideEMTLayer();
        } else if (selectedTab === 'emt'){
            showEMTLayer();
            hideBicimadLayer();
        }
        updateSidebarForTab(selectedTab);
    });
});


function showBicimadLayer() {console.log("MOSTRAR Bicimad")};
function hideBicimadLayer() {console.log("OCULTAR Bicimad")};
function showEMTLayer() {console.log("MOSTRAR EMT")};
function hideEMTLayer() {console.log("OCULTAR EMT")};
function updateSidebarForTab(tab) {console.log(`Sidebar de ${tab}`)};
