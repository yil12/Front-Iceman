import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // ¡No olvides importar el CSS de Leaflet!

const position: LatLngExpression = [10.4, -75.5]; // Cartagena aprox. :-)

const { BaseLayer } = LayersControl;

export default function MapView() {
  console.log("MapView render");

  return (
    <div
      style={{
        height: '100vh',           // o '100%' si está dentro de otro contenedor
        width: '100%',             // padre ocupa todo
        display: 'flex',           // o 'block'
        justifyContent: 'flex-start', // empuja todo a la izquierda
      }}
    >
      {/* Aquí va el mapa alineado a la izquierda */}
      <div
        style={{
          height: '100%',
          width: '65%',            // ← ajusta este valor: 50%, 600px, etc.
          // marginRight: 'auto',  // opcional, pero ayuda en algunos casos
        }}
      >
        <MapContainer
          center={position}
          zoom={6}                 // zoom inicial más razonable para Colombia/Caribe
          minZoom={2}
          maxZoom={18}             // corrige: maxZoom vacío no es válido
          maxBounds={[
            [-85, -180],
            [85, 180],
          ]}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          style={{ height: '100%', width: '100%' }}
        >
          <LayersControl position="topright">
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                noWrap
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>

            <BaseLayer name="OpenStreetMap France">
              <TileLayer
                noWrap
                attribution='&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
              />
            </BaseLayer>

            <BaseLayer name="OpenTopoMap">
              <TileLayer
                noWrap
                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>

            <BaseLayer name="Stadia Dark">
              <TileLayer
                noWrap
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
            </BaseLayer>
          </LayersControl>
        </MapContainer>
      </div>

      {/* Espacio a la derecha para tu modal o panel de estaciones */}
      <div style={{ height: '100%', width: '35%', background: '#f0f0f0' }}>
        {/* Aquí pondrías tu ModalDetails o lista de boyas */}
        <p>Panel lateral (estaciones, filtros, etc.)</p>
      </div>
    </div>
  );
}