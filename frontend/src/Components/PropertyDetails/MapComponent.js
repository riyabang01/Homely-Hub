import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = ({ address }) => {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayAddress = address
    ? `${address.area ? address.area + ", " : ""}${address.city || ""}, ${address.state || ""}`
    : "Location";

  useEffect(() => {
    let isMounted = true;
    if (!address) {
      setLoading(false);
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const queryStrings = [
          `${address.city || ""}, ${address.state || ""} ${address.pincode || ""}`,
          `${address.city || ""}, ${address.state || ""}`,
          `${address.state || ""}`
        ].filter(Boolean);

        let data = [];
        for (const query of queryStrings) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            {
              headers: {
                "User-Agent": "HomelyHubStayApp/1.0"
              }
            }
          );
          data = await response.json();
          if (data.length > 0) break;
        }

        if (isMounted) {
          if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCoordinates([lat, lon]);
            setError(null);
          } else {
            setCoordinates([32.2396, 77.1887]);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setCoordinates([32.2396, 77.1887]);
          setLoading(false);
        }
      }
    };

    fetchCoordinates();

    return () => {
      isMounted = false;
    };
  }, [address]);

  return (
    <div>
      {loading && <p style={{ textAlign: "center", padding: "10px" }}>Loading Map...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {coordinates.length === 2 && (
        <MapContainer
          center={coordinates}
          zoom={13}
          style={{ height: "320px", width: "100%", borderRadius: "8px", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates}>
            <Popup>{displayAddress}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
