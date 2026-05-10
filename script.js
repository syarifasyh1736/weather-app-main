const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const windSpeed = document.getElementById("windSpeed");
const precipitation = document.getElementById("precipitation");
const weatherIcon = document.getElementById("weatherIcon");
const hourlyForecast = document.getElementById("hourlyForecast");
const dailyForecast = document.getElementById("dailyForecast");
const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");
const apikey = "0410502e9202e39b25064703276d3bfe";
const unitToggle = document.getElementById("unitToggle");
const unitDropdown = document.getElementById("unitDropdown");
const mmBtn = document.getElementById("mmBtn");
const inchBtn = document.getElementById("inchBtn");
const kmBtn = document.getElementById("kmBtn");
const mphBtn = document.getElementById("mphBtn");
let tempUnit = "metric";
let currentCity = "Samarinda";
let windUnit = "km/h";
let precipitationUnit = "mm";

async function getWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=${tempUnit}`);

  const data = await response.json();

  if (data.cod == 404) {
    alert("City not found");
    return;
  }

  console.log(data);

  cityName.innerHTML = data.name;
  temperature.innerHTML = Math.round(data.main.temp) + "°";
  humidity.innerHTML = data.main.humidity + "%";
  feelsLike.innerHTML = Math.round(data.main.feels_like) + "°";
  if (windUnit === "km/h") {
    windSpeed.innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
  } else {
    windSpeed.innerHTML = Math.round(data.wind.speed) + " mph";
  }

  let rainValue = data.rain?.["1h"] || 0;

  if (precipitationUnit === "inch") {
    rainValue = (rainValue / 25.4).toFixed(2);

    precipitation.innerHTML = rainValue + " in";
  } else {
    precipitation.innerHTML = rainValue + " mm";
  }

  const weatherMain = data.weather[0].main;
  console.log(weatherMain);
  if (weatherMain === "Clouds") {
    weatherIcon.src = "assets/images/icon-partly-cloudy.webp";
  } else if (weatherMain === "Rain") {
    weatherIcon.src = "assets/images/icon-rain.webp";
  } else if (weatherMain === "Clear") {
    weatherIcon.src = "assets/images/icon-sunny.webp";
  } else if (weatherMain === "Snow") {
    weatherIcon.src = "assets/images/icon-snow.webp";
  } else if (weatherMain === "Thunderstorm") {
    weatherIcon.src = "assets/images/icon-storm.webp";
  } else if (weatherMain === "Drizzle") {
    weatherIcon.src = "assets/images/icon-drizzle.webp";
  } else if (weatherMain === "Fog" || weatherMain === "Mist") {
    weatherIcon.src = "assets/images/icon-fog.webp";
  }
}

async function getForecast(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=${tempUnit}`);

  const data = await response.json();

  console.log(data);

  hourlyForecast.innerHTML = "";

  data.list.slice(0, 8).forEach((item) => {
    const time = item.dt_txt.slice(11, 16);

    const temp = Math.round(item.main.temp);

    const weatherMain = item.weather[0].main;

    let icon = "icon-sunny.webp";

    if (weatherMain === "Clouds") {
      icon = "icon-partly-cloudy.webp";
    } else if (weatherMain === "Rain") {
      icon = "icon-rain.webp";
    } else if (weatherMain === "Clear") {
      icon = "icon-sunny.webp";
    } else if (weatherMain === "Snow") {
      icon = "icon-snow.webp";
    } else if (weatherMain === "Thunderstorm") {
      icon = "icon-storm.webp";
    } else if (weatherMain === "Drizzle") {
      icon = "icon-drizzle.webp";
    } else if (weatherMain === "Fog" || weatherMain === "Mist") {
      icon = "icon-fog.webp";
    }

    hourlyForecast.innerHTML += `
  
    <div class="bg-[#312F4B] rounded-lg px-4 py-3 flex items-center justify-between">
    
      <div class="flex items-center gap-3">
        <img src="assets/images/${icon}" class="w-8 h-8" />
        
        <span>${time}</span>
      </div>

      <span>${temp}°</span>

    </div>

  `;
  });
}

async function getDailyForecast(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=${tempUnit}`);

  const data = await response.json();

  dailyForecast.innerHTML = "";

  const dailyData = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  dailyData.forEach((item) => {
    const day = new Date(item.dt_txt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const tempMax = Math.round(item.main.temp_max);
    const tempMin = Math.round(item.main.temp_min);

    const weatherMain = item.weather[0].main;

    let icon = "icon-sunny.webp";

    if (weatherMain === "Clouds") {
      icon = "icon-partly-cloudy.webp";
    } else if (weatherMain === "Rain") {
      icon = "icon-rain.webp";
    } else if (weatherMain === "Clear") {
      icon = "icon-sunny.webp";
    } else if (weatherMain === "Snow") {
      icon = "icon-snow.webp";
    } else if (weatherMain === "Thunderstorm") {
      icon = "icon-storm.webp";
    } else if (weatherMain === "Drizzle") {
      icon = "icon-drizzle.webp";
    } else if (weatherMain === "Fog" || weatherMain === "Mist") {
      icon = "icon-fog.webp";
    }

    dailyForecast.innerHTML += `
    
      <div class="bg-[#272541] rounded-2xl p-4 text-center">
      
        <p class="text-sm mb-4">${day}</p>

        <img src="assets/images/${icon}"
        class="w-12 h-12 mx-auto mb-4" />

        <div class="flex justify-between text-sm">
          <span>${tempMax}°</span>
          <span class="text-white/60">${tempMin}°</span>
        </div>

      </div>

    `;
  });
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value;

  currentCity = city;
  getWeather(city);
  getForecast(city);
  getDailyForecast(city);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value;

    currentCity = city;
    getWeather(city);
    getForecast(city);
    getDailyForecast(city);
  }
});

fahrenheitBtn.addEventListener("click", () => {
  tempUnit = "imperial";

  celsiusCheck.classList.add("hidden");
  fahrenheitCheck.classList.remove("hidden");

  celsiusBtn.classList.remove("bg-[#312F4B]");
  fahrenheitBtn.classList.add("bg-[#312F4B]");

  getWeather(currentCity);
  getForecast(currentCity);
  getDailyForecast(currentCity);
});

celsiusBtn.addEventListener("click", () => {
  tempUnit = "metric";

  fahrenheitCheck.classList.add("hidden");
  celsiusCheck.classList.remove("hidden");

  fahrenheitBtn.classList.remove("bg-[#312F4B]");
  celsiusBtn.classList.add("bg-[#312F4B]");

  getWeather(currentCity);
  getForecast(currentCity);
  getDailyForecast(currentCity);
});

unitToggle.addEventListener("click", () => {
  unitDropdown.classList.toggle("hidden");

  dropdownIcon.classList.toggle("rotate-180");
});

mmBtn.addEventListener("click", () => {
  precipitationUnit = "mm";

  inchCheck.classList.add("hidden");
  mmCheck.classList.remove("hidden");

  inchBtn.classList.remove("bg-[#312F4B]");
  mmBtn.classList.add("bg-[#312F4B]");

  getWeather(currentCity);
});

inchBtn.addEventListener("click", () => {
  precipitationUnit = "inch";

  mmCheck.classList.add("hidden");
  inchCheck.classList.remove("hidden");

  mmBtn.classList.remove("bg-[#312F4B]");
  inchBtn.classList.add("bg-[#312F4B]");

  getWeather(currentCity);
});

kmBtn.addEventListener("click", () => {
  windUnit = "km/h";

  mphCheck.classList.add("hidden");
  kmCheck.classList.remove("hidden");

  mphBtn.classList.remove("bg-[#312F4B]");
  kmBtn.classList.add("bg-[#312F4B]");

  getWeather(currentCity);
});

mphBtn.addEventListener("click", () => {
  windUnit = "mph";

  kmCheck.classList.add("hidden");
  mphCheck.classList.remove("hidden");

  kmBtn.classList.remove("bg-[#312F4B]");
  mphBtn.classList.add("bg-[#312F4B]");

  getWeather(currentCity);
});

getWeather(currentCity);
getForecast(currentCity);
getDailyForecast(currentCity);
