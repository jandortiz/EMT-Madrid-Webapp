/**
 * Asigna íconos de colores (verde, naranja, rojo) basándose en la disponibilidad de cada estación.
 * @param {number} dockBikes - Cantidad de bicicletas en la estación.
 * @param {number} totalBases - Cantidad total de bases en la estación.
 * @returns {Object} Diccionario con información de los íconos y sus respectivos colores.
 */
export function getBikeIcons(dockBikes, totalBases){
    let color;
    let firstInterval = Math.round(totalBases/3);
    let secondInterval = firstInterval * 2;

    if (dockBikes <= firstInterval) color = "red";
    else if (dockBikes < secondInterval) color = "orange";
    else color = "green";

    let response = {
        "icon-shape": L.divIcon({
            className: "custom-bike-icon",
            html: `<i class="fa-solid fa-bicycle" style="color:${color}; font-size:20px;"></i>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        }),
        "icon-color": color

    };
    return response;
}


/**
 * Crea los elementos con información sobre las estaciones y su disponibilidad.
 * @param {Object} station 
 * @param {HTMLElement} ulElement 
 * @param {Object} stationMarkers 
 */
export function getListItems(station, ulElement, stationMarkers, map){
    
    let liElement;
    liElement = document.createElement("li");
    liElement.innerHTML = `
    <b>📍${station.name}</b><br> 🚲 ${station.dock_bikes} bicis | 🅿️ ${station.free_bases} anclajes`;
    console.log("estoy acá");


    liElement.addEventListener("click", function (e) {
        document.querySelectorAll("#station-list li").forEach(el =>{
            el.classList.remove("active");
        });

        liElement.classList.add("active");

        let lon = station.geometry.coordinates[0];
        let lat = station.geometry.coordinates[1];
        stationMarkers[station.id].openPopup();
        map.setView([lat, lon], 16);
    });
    
    ulElement.append(liElement);
}