const apiKey = "e91c178d591dcfc18b7fe40ca94cb34c";
let chart;

function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* 🌍 AUTO LOCATION */
function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  });
}

/* CITY SEARCH */
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      getWeatherByCoords(data.coord.lat, data.coord.lon);
    });
}

/* CORE WEATHER */
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("result");

  if (!city) {
    result.innerHTML = "❌ Enter a city name";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        result.innerHTML = "❌ City not found";
        return;
      }

      result.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <h1>${data.main.temp}°C</h1>
        <p>${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
      `;
    })
    .catch(() => {
      result.innerHTML = "⚠️ Error fetching weather";
    });
}


/* 📆 7 DAY FORECAST */
function showForecast(days) {
  let html = "";
  days.slice(1,8).forEach(d => {
    html += `
      <div>
        <p>${new Date(d.dt * 1000).toLocaleDateString("en",{weekday:"short"})}</p>
        <p>${d.temp.day}°C</p>
      </div>
    `;
  });
  document.getElementById("forecast").innerHTML = html;
}

/* 📊 GRAPH */
function drawChart(days) {
  const ctx = document.getElementById("tempChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days.slice(0,7).map(d =>
        new Date(d.dt * 1000).toLocaleDateString("en",{weekday:"short"})
      ),
      datasets: [{
        label: "Temperature °C",
        data: days.slice(0,7).map(d => d.temp.day),
        borderWidth: 2
      }]
    }
  });
}



