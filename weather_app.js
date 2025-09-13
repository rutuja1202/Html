const apiKey = "YOUR_API_KEY"; // 🔑 Replace with your OpenWeatherMap API key

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (city) {
    getWeather(city);
  } else {
    showError("Please enter a city name");
  }
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weatherResult");

  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;

  weatherDiv.innerHTML = `
    <h2>${name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <p><strong>Temperature:</strong> ${temp} °C</p>
    <p><strong>Weather:</strong> ${description}</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
  `;
}

function showError(message) {
  const weatherDiv = document.getElementById("weatherResult");
  weatherDiv.innerHTML = <p class="error">${message}</p>;
}