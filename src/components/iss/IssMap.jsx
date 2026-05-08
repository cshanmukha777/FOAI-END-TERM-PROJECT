import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25]
});

export const IssMap = ({ position, path }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom());
    }
  }, [position]);

  if (!position) return <div className="h-64 sm:h-96 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />;

  return (
    <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative z-0">
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={4} 
        ref={mapRef}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {path.length > 1 && (
          <Polyline positions={path} color="#3b82f6" weight={3} dashArray="10, 10" />
        )}
        
        <Marker position={[position.lat, position.lng]} icon={issIcon}>
          <Popup className="custom-popup">
            <div className="text-center font-semibold text-slate-800">ISS Current Location</div>
            <div className="text-sm text-slate-500">Lat: {position.lat.toFixed(4)}</div>
            <div className="text-sm text-slate-500">Lng: {position.lng.toFixed(4)}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
