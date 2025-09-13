// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Sample locations with markers
const locations = [
  { name: "Taj Mahal", coords: [27.1751, 78.0421], description: "A UNESCO World Heritage site in Agra." },
  { name: "Gateway of India", coords: [18.922, 72.8347], description: "Iconic arch monument in Mumbai." },
  { name: "Red Fort", coords: [28.6562, 77.241], description: "Historic fort in Delhi." },
  { name: "Charminar", coords: [17.3616, 78.4747], description: "Famous mosque in Hyderabad." },
  { name: "India Gate", coords: [28.6129, 77.2295], description: "War memorial in New Delhi." }
];

// Add markers to the map
locations.forEach(loc => {
  const marker = L.marker(loc.coords).addTo(map);
  marker.bindPopup(`<b>${loc.name}</b><br>${loc.description}`);
});

// Search functionality
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const location = locations.find(loc => loc.name.toLowerCase().includes(query));

  if (location) {
    map.setView(location.coords, 13); // Zoom into location
    L.popup()
      .setLatLng(location.coords)
      .setContent(`<b>${location.name}</b><br>${location.description}`)
      .openOn(map);
  } else {
    alert("Location not found!");
  }
});