// Initialize the map
    const map = L.map("map", {
      center: [listing.geometry.coordinates[1], listing.geometry.coordinates[0]], // [lat, lon]
      zoom: 8
    });

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);


   
  // Add marker with popup
   L.marker([listing.geometry.coordinates[1], listing.geometry.coordinates[0]])
  .addTo(map)
  .bindPopup(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`) 
  .openPopup();
