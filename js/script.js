
const bugin = document.getElementById("bugin");
const kazakh = document.getElementById("kazakh");
const input = document.querySelector(".input");
const inputBtn = document.querySelector(".input-btn");
const mainContainer = document.createElement("div");
mainContainer.id = "main";
document.body.appendChild(mainContainer);

const openweatherIconApi = "http://openweathermap.org/img/w/";
const weathersApi = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "&appid=e3ad77404dc88bee59f4a50942c3dbc6";
const lang = "&lang=ru";
const units = "&units=metric";


bugin.addEventListener("click", async (e) => {
    e.preventDefault();
    bugin.style.textDecoration="underline";
    kazakh.style.textDecoration="none";
    mainContainer.innerHTML = ""; 
    await getWeatherByCity("Алматы");
});


kazakh.addEventListener("click", async (e) => {
    e.preventDefault();
    mainContainer.innerHTML = ""; 
    kazakh.style.textDecoration="underline";
    bugin.style.textDecoration="none";
    const cities = ["Almaty",
      "Astana",
      "Shymkent",
      "Karaganda",
      "Aktobe",
      "Pavlodar",
      "Kostanay",
      "Kyzylorda",
      "Atyrau",
      "Taraz",
      "Oral",
      "Oskemen",
      "Semipalatinsk",
      "Aktau",
      "Turkestan",
      "Temirtau",
      "Kokshetau",
      "Petropavlovsk",
      "Ekibastuz",
      "Balkhash"];

      cities.forEach(async (city) => {
        await getWeatherByCity(city, true);
    });
});


inputBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const cityName = input.value.trim();

    if (cityName !== "") {
        await getWeatherByCity(cityName, true);
    }
});


async function getWeatherByCity(city, multiple = false) {
    const url = `${weathersApi}q=${city}${apiKey}${units}${lang}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Қала табылмады");
        }
        const data = await response.json();

        const iconUrl = openweatherIconApi + data.weather[0].icon + ".png";
        const weatherCard = document.createElement("div");
        weatherCard.classList.add("weather-box");
        weatherCard.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <img class="local-icons" src="${iconUrl}" alt="${data.weather[0].description}">
            <p>${data.weather[0].description}</p>
            <p class="local-temp">${data.main.temp}°C</p>
        `;

        if (multiple) {
            mainContainer.appendChild(weatherCard); 
        } else {
            mainContainer.innerHTML = ""; 
            mainContainer.appendChild(weatherCard);
        }
    }
    catch (error) {
        console.error(error);
        const errorMsg = document.createElement("p");
        errorMsg.style.color = "red";
        errorMsg.textContent = "Қала табылмады. Басқа қала атауын енгізіңіз.";
        errorMsg.style.textAlign="center"
        errorMsg.style.fontSize="50px"
        errorMsg.style.padding="50px"
        
        mainContainer.innerHTML = "";
        mainContainer.appendChild(errorMsg);
    }
}




function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.error("Geolocation қолдау көрсетпейді.");
    }
}


async function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `${weathersApi}lat=${lat}&lon=${lon}${apiKey}${units}${lang}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Желіден деректер алу мүмкін емес.");
        }
        const data = await response.json();

        const iconUrl = openweatherIconApi + data.weather[0].icon + ".png";
        document.getElementById("local-weather").innerHTML = `
            <img class="local-icons" src="${iconUrl}" alt="${data.weather[0].description}">
            <p>${data.weather[0].description}</p>
            <p class="local-temp">${data.main.temp}°C</p>
        `;
    }
    catch (error) {
        console.error(error);
    }
}

getLocation();

