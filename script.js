const API_KEY = 'DEMO_KEY'; // Replace if needed

// Tabs
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// 1. Image of the Day
fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('apod-img').src = data.url;
    document.getElementById('apod-desc').innerText = data.explanation;
  });

// 2. Asteroids
const today = new Date().toISOString().split('T')[0];

fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('asteroid-list');
    const asteroids = data.near_earth_objects[today];
    asteroids.forEach(asteroid => {
      const li = document.createElement('li');
      li.innerText = `${asteroid.name} - ${asteroid.is_potentially_hazardous_asteroid ? '⚠️ Hazardous' : '✅ Safe'}`;
      list.appendChild(li);
    });
  });

// 3. Mars Rover Photos
window.fetchMarsPhotos = function () {
  const date = document.getElementById('mars-date').value;
  if (!date) return alert("Please select a date!");

  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const photoDiv = document.getElementById('mars-photos');
      photoDiv.innerHTML = '';
      if (data.photos.length === 0) {
        photoDiv.innerHTML = "<p>No photos available for this date.</p>";
        return;
      }
      data.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.img_src;
        photoDiv.appendChild(img);
      });
    });
};

// Example: Fetch and display exoplanets data from NASA Exoplanet Archive
// You can place this in a script tag in your HTML file or in a JS file

const apiUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse+from+ps+limit+10&format=json';

async function fetchExoplanets() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayExoplanets(data);
    } catch (error) {
        console.error('Error fetching exoplanets data:', error);
    }
}

function displayExoplanets(planets) {
    const container = document.getElementById('exoplanets');
    if (!container) return;
    container.innerHTML = '<h2>NASA Exoplanet Archive Data</h2>';
    planets.forEach(planet => {
        container.innerHTML += `
            <div>
                <strong>Name:</strong> ${planet.pl_name}<br>
                <strong>Host Star:</strong> ${planet.hostname}<br>
                <strong>Discovery Method:</strong> ${planet.discoverymethod}<br>
                <strong>Discovery Year:</strong> ${planet.disc_year}<br>
                <strong>Orbital Period (days):</strong> ${planet.pl_orbper}<br>
                <strong>Radius (Earth radii):</strong> ${planet.pl_rade}<br>
                <strong>Mass (Earth masses):</strong> ${planet.pl_bmasse}<br>
            </div>
            <hr>
        `;
    });
}

// Call the function on page load
window.onload = function() {
  fetchExoplanets();
  fetchMarsPhotos();
};
