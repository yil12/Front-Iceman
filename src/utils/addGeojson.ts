import L, { Map as LeafletMap, GeoJSON } from "leaflet";
import type { Feature, Point, FeatureCollection, Geometry } from "geojson";

// Registro global de capas
const layersRegistry = new Map<string, GeoJSON>();

let selectedLayer: L.CircleMarker | null = null;
let selectedMarker: L.Marker | null = null;

export function toggleGeoJsonOnMap(
    map: LeafletMap,
    geojson: FeatureCollection<Geometry>,
    id: string,
    markerShape: "circle-red" | "circle-blue" = "circle-red",
    onFeatureClick: (feature: Feature) => void,
    style?: L.PathOptions
): GeoJSON | null {

    // 🔹 Si la capa ya existe la removemos
    const existingLayer = layersRegistry.get(id);

    if (existingLayer) {
        map.removeLayer(existingLayer);
        layersRegistry.delete(id);
        return null;
    }

    // 🔹 Crear pane si no existe
    if (!map.getPane("geojsonPane")) {
        map.createPane("geojsonPane");
        map.getPane("geojsonPane")!.style.zIndex = "650";
    }

    findFeaturesAtSameLocation(geojson);

    const geoJsonLayer = L.geoJSON(geojson, {
        pane: "geojsonPane",

        style: style ?? {
            color: "blue",
            weight: 2,
            opacity: 0.6,
        },

        pointToLayer: (_feature, latlng) => {

            const baseColor =
                markerShape === "circle-blue"
                    ? "#2563eb"
                    : "#10b981";

            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: baseColor,
                color: "#ffffff",
                weight: 2,
                opacity: 1,
                fillOpacity: 1,
            });

        },

        onEachFeature: (feature, layer) => {

            if (!(layer instanceof L.CircleMarker)) return;

            // 🔹 TOOLTIP nombre estación
            const stationName =
                feature.properties?.Estacion ||
                feature.properties?.station ||
                feature.properties?.name ||
                "Estación";

            layer.bindTooltip(stationName, {
                direction: "top",
                offset: [0, -10],
                opacity: 0.9,
            });

            // Hover
            layer.on("mouseover", () => {
                if (layer !== selectedLayer) {
                    layer.setStyle({ radius: 10 });
                }
            });

            layer.on("mouseout", () => {
                if (layer !== selectedLayer) {
                    layer.setStyle({ radius: 8 });
                }
            });

            // Click selección
            layer.on("click", (e) => {

                L.DomEvent.stopPropagation(e);

                // Restaurar anterior
                if (selectedLayer) {
                    selectedLayer.setStyle({
                        radius: 8,
                        opacity: 1,
                        fillOpacity: 1,
                    });
                }

                if (selectedMarker) {
                    map.removeLayer(selectedMarker);
                }

                selectedLayer = layer;

                const latlng = layer.getLatLng();

                // ocultar círculo
                layer.setStyle({
                    opacity: 0,
                    fillOpacity: 0,
                });

                // agregar pin
                selectedMarker = L.marker(latlng, {
                    icon: placeIcon,
                    interactive: false,
                    pane: "geojsonPane"
                }).addTo(map);

                onFeatureClick(feature);

            });

        },

    });

    geoJsonLayer.addTo(map);
    layersRegistry.set(id, geoJsonLayer);

    return geoJsonLayer;
}

function findFeaturesAtSameLocation(
    geojson: FeatureCollection<Geometry>
) {

    const featuresByLocation: Record<string, Feature[]> = {};

    geojson.features.forEach((feature) => {

        const geometry = feature.geometry as Point;

        if (geometry.type === "Point") {

            const coords = geometry.coordinates;
            const key = `${coords[0]},${coords[1]}`;

            if (!featuresByLocation[key]) {
                featuresByLocation[key] = [];
            }

            featuresByLocation[key].push(feature);

        }

    });

    return featuresByLocation;
}

export function clearSelectedMarker(map: L.Map) {

    if (selectedLayer) {
        selectedLayer.setStyle({
            radius: 8,
            opacity: 1,
            fillOpacity: 1,
        });
        selectedLayer = null;
    }

    if (selectedMarker) {
        map.removeLayer(selectedMarker);
        selectedMarker = null;
    }

}

const placeIcon = L.divIcon({
    className: "mui-place-icon",
    html: `
    <svg xmlns="http://www.w3.org/2000/svg"
         height="32"
         viewBox="0 0 24 24"
         width="32"
         fill="#0e0d0d">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 
      7-13c0-3.87-3.13-7-7-7zm0 
      9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 
      6.5 12 6.5s2.5 1.12 2.5 
      2.5S13.38 11.5 12 11.5z"/>
    </svg>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});