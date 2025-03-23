import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const GPSMap = () => {
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiZWxwZXNjYWQiLCJhIjoiY204Zjk4MTJ6MGFidjJpcHZrb3V1ejIzayJ9.t1zYkNwgZEkO1L0zC2CY_Q"; // ✅ Replace with your Mapbox key

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.1785, 40.7416],
      zoom: 15,
    });

    const geojsonData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { location: "Faculty Memorial Hall" },
          geometry: { type: "Point", coordinates: [-74.178823, 40.741919] },
        },
        {
          type: "Feature",
          properties: { location: "Tiernan Hall" },
          geometry: { type: "Point", coordinates: [-74.179636, 40.741814] },
        },
      ],
    };

    map.on("load", () => {
      map.addSource("buildings", { type: "geojson", data: geojsonData });

      map.addLayer({
        id: "building-markers",
        type: "circle",
        source: "buildings",
        paint: { "circle-radius": 8, "circle-color": "#FF5733" },
      });
    });
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default GPSMap;
