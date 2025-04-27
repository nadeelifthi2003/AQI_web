document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([6.9271, 79.8612], 12);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © OpenStreetMap contributors"
    }).addTo(map);
  
    fetch("https://localhost:7086/api/aqidata/latest")
      .then(res => res.json())
      .then(sensors => {
        sensors.forEach(sensor => {
          const color = getAQIColor(sensor.aqi);
          const marker = L.circleMarker([sensor.latitude, sensor.longitude], {
            radius: 10,
            color,
            fillOpacity: 0.7
          }).addTo(map);
  
          marker.bindPopup(`
            <strong>${sensor.sensorName}</strong><br/>
            AQI: <span style="color:${color}; font-weight:bold;">${sensor.aqi}</span>
          `);
        });
      });
  
    function getAQIColor(aqi) {
      if (aqi <= 50) return "green";
      if (aqi <= 100) return "orange";
      return "red";
    }
  });
  