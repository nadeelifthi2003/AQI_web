const apiBase = "https://localhost:5001/api";

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadSensors();
  loadAlerts();
});

function loadDashboard() {
  fetch(`${apiBase}/dashboard/status`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("dashboard-summary").innerHTML = `
        <div class="col-md-3"><div class="card"><div class="card-body">Total Sensors: <b>${data.totalSensors}</b></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Active Sensors: <b>${data.activeSensors}</b></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Simulation: <b class="text-${data.isSimulationRunning ? 'success' : 'danger'}">${data.isSimulationRunning ? "Running" : "Stopped"}</b></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Last Data Time: <b>${data.lastDataTime}</b></div></div></div>
      `;
    });
}

function loadSensors() {
  fetch(`${apiBase}/sensors`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("sensor-table-body");
      tbody.innerHTML = "";
      data.forEach(sensor => {
        tbody.innerHTML += `
          <tr>
            <td>${sensor.id}</td>
            <td>${sensor.sensorName}</td>
            <td>${sensor.location}</td>
            <td>${sensor.isActive ? "✅ Active" : "❌ Inactive"}</td>
            <td>
              ${sensor.isActive
                ? `<button class="btn btn-sm btn-warning" onclick="deactivateSensor(${sensor.id})">Deactivate</button>`
                : `<i>N/A</i>`
              }
            </td>
          </tr>`;
      });
    });
}

function deactivateSensor(id) {
  fetch(`${apiBase}/sensors/${id}/deactivate`, { method: "PATCH" })
    .then(() => loadSensors());
}

function startSimulation() {
  fetch(`${apiBase}/simulation/start`, { method: "POST" })
    .then(() => {
      alert("Simulation started");
      loadDashboard();
    });
}

function stopSimulation() {
  fetch(`${apiBase}/simulation/stop`, { method: "POST" })
    .then(() => {
      alert("Simulation stopped");
      loadDashboard();
    });
}

function loadAlerts() {
  fetch(`${apiBase}/alerts`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("alert-table-body");
      tbody.innerHTML = "";
      data.forEach(alert => {
        tbody.innerHTML += `
          <tr>
            <td>${alert.category}</td>
            <td>${alert.minValue} - ${alert.maxValue}</td>
            <td><span style="color:${alert.color}; font-weight:bold;">${alert.color}</span></td>
          </tr>`;
      });
    });
}
