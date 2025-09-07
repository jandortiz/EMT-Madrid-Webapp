/**
 * Hace petición al endpoint /bicimadrid/latest para obtener información de
 * las estaciones de bicicletas.
 * @returns {Array<string>} Lista con estaciones.
 */
export async function getBicimadStations() {

    const response = await fetch(
        "http://127.0.0.1:8000/bicimad/latest", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }
    );
    const result = await response.json();
    return result;
}


export async function getEMTStops() {
    let response = await fetch(
        "http://127.0.0.1:8000/emt/stops", {
            method: "GET",
            headers: {"Content-Type": "applicacion/json"}
        }
    );
    let result = await response.json();
    return result;
}