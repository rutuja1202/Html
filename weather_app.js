// weather_app.js
// Uses Open-Meteo (no API key) + Open-Meteo geocoding API for city->lat/lon
// Make sure this file is named "weather_app.js" and sits next to index.html

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const resultEl = document.getElementById('weatherResult');

searchBtn.addEventListener('click', fetchWeatherForInput);
cityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchWeatherForInput(); });

async function fetchWeatherForInput() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name');
    return;
  }
  showLoading();
  try {
    // 1) Geocoding: convert city name to lat/lon
    const geo = await geocodeCity(city);
    if (!geo) {
      showError(`Could not find location for "${city}". Try a different name.`);
      return;
    }

    // 2) Fetch weather (current + hourly temp for today)
    const weather = await fetchWeather(geo.latitude, geo.longitude);
    renderWeather(geo, weather);
  } catch (err) {
    console.error(err);
    showError('Failed to retrieve weather. Check your connection and try again.');
  }
}

function showLoading() {
  resultEl.innerHTML = '<div class="center small">Loading weather…</div>';
}

function showError(msg) {
  resultEl.innerHTML = `<div class="error center">${escapeHtml(msg)}</div>`;
}

// simple escape to avoid HTML injection
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// Geocoding via Open-Meteo's geocoding API
// Docs: https://open-meteo.com/en/docs/geocoding-api
async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!data || !data.results || data.results.length === 0) return null;
  return data.results[0]; // {name, latitude, longitude, country, timezone}
}

// Fetch weather using Open-Meteo forecast API
// Request current_weather and hourly temperature for next 24 hours
async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'temperature_2m,relativehumidity_2m,precipitation',
    current_weather: 'true',
    timezone: 'auto'
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

function renderWeather(geo, weatherData) {
  if (!weatherData) return showError('No weather data available');
  const cw = weatherData.current_weather || null;

  // Build small hourly preview (next 6 hours)
  let hourlyHtml = '';
  if (weatherData.hourly && weatherData.hourly.time && weatherData.hourly.temperature_2m) {
    const nowIndex = weatherData.hourly.time.indexOf(cw ? cw.time : weatherData.hourly.time[0]);
    const start = Math.max(0, nowIndex);
    const end = Math.min(weatherData.hourly.time.length, start + 6);
    const items = [];
    for (let i = start; i < end; i++) {
      const t = weatherData.hourly.time[i];
      const temp = Math.round(weatherData.hourly.temperature_2m[i]);
      items.push(`<div class="small">${new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}: ${temp}°C</div>`);
    }
    hourlyHtml = `<div style="margin-top:8px">${items.join('')}</div>`;
  }

  const cityLine = `${escapeHtml(geo.name)}${geo.admin1 ? ', ' + escapeHtml(geo.admin1) : ''}${geo.country ? ', ' + escapeHtml(geo.country) : ''}`;

  const html = `
    <div class="card">
      <div class="main">
        <div class="city">${cityLine}</div>
        ${cw ? `<div class="temp">${Math.round(cw.temperature)}°C</div>` : ''}
        <div class="small">Wind: ${cw ? cw.windspeed + ' km/h' : '—'} • Direction: ${cw ? cw.winddirection + '°' : '—'}</div>
        ${hourlyHtml}
      </div>
    </div>
  `;
  resultEl.innerHTML = html;
}
