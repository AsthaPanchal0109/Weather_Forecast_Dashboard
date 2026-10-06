//DOM References
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const statusMessage = document.querySelector(".statusMessage");
const cityName = document.querySelector(".cityName");
const cityTemp = document.querySelector(".cityTemp");
const cityHumidity = document.querySelector(".cityHumidity");
const windSpeed = document.querySelector(".windSpeed");
const feelsLike = document.querySelector(".feelsLike");
const weatherDesc = document.querySelector(".weatherDesc");
const forecastCards = document.querySelectorAll(".placard");
const currentDay = document.querySelector(".currentDay");
const currentDateElement = document.querySelector(".currentDate");


//Event Listener
weatherForm.addEventListener("submit", handleSearch);

async function handleSearch(event){
    event.preventDefault();

    const city = cityInput.value.trim();

    //input Validation
    if (city === "") {
        statusMessage.textContent = "Please enter a city name";
        return;
    }

    statusMessage.textContent = "Loading Weather.....";

    try {

        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);

        if(!response.ok) {
            throw new Error("Geocoding request failed");
        }

        const data = await response.json();

        if(!data.results || data.results.length === 0){
            statusMessage.textContent = "City not found.";
            return;
        }

        const location = data.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const locationName = location.name;
        
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`);

        if(!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        const daily = weatherData.daily;

        const today = new Date(daily.time[0]);

        //extracting day and date
        const day = today.toLocaleDateString("en-IN" , {weekday: "long"});
        const date = today.toLocaleDateString("en-IN", { day: "numeric",
                    month: "long",
                    year: "numeric"
        });

        for (let i=0; i<forecastCards.length;i++)
        {
        
            const forecastDateValue = new Date(daily.time[i+1]);

            const forecastDay = forecastCards[i].querySelector(".forecastDay");
            const day = forecastDateValue.toLocaleDateString("en-IN", {weekday : "long"});
            forecastDay.textContent = day;

            const forecastDate = forecastCards[i].querySelector(".forecastDate");
            const date = forecastDateValue.toLocaleDateString("en-In", 
            {   day: "numeric",
                month: "long",
                year: "numeric"
            });
            forecastDate.textContent = date;

            const minTempElement = forecastCards[i].querySelector(".minTemp");
            minTempElement.textContent = `Min Temp: ${daily.temperature_2m_min[i+1]}℃`;

            const maxTempElement = forecastCards[i].querySelector(".maxTemp");
            maxTempElement.textContent = `Max Temp: ${daily.temperature_2m_max[i+1]}℃`;

            const forecastCondition = forecastCards[i].querySelector(".forecastCond");
            forecastCondition.textContent = getWeatherDescription(daily.weather_code[i+1]);
        }

        const temperature = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const feels_Like = current.apparent_temperature;
        const wind_Speed = current.wind_speed_10m;
        const weatherCode = current.weather_code;
        const isDay = current.is_day;

        applyWeatherTheme(weatherCode, isDay);

        cityTemp.textContent = `${temperature}℃`;
        cityHumidity.textContent = `Humidity: ${humidity}%`;
        windSpeed.textContent = `Wind Speed: ${wind_Speed} km/h`;
        feelsLike.textContent = `Feels Like: ${feels_Like}℃`;
        weatherDesc.textContent = getWeatherDescription(weatherCode);
        cityName.textContent = `${locationName}`;
        currentDay.textContent = day;
        currentDateElement.textContent = date;

        statusMessage.textContent = "";
        
    }
    catch(error) {
        statusMessage.textContent = "Unable to fetch weather. Please try again.";
        console.error(error);
        
        
    }    
        
}


function getWeatherDescription(weatherCode){
    if (weatherCode === 0) {
        return "Clear Sky ☀️";
    }

    if (weatherCode === 1 || weatherCode === 2) {
        return "Partly Cloudy 🌤️";
    }

    if (weatherCode === 3) {
        return "Overcast ☁️";
    }

    if (weatherCode==45 || weatherCode==48) {
        return "Fog 🌁";
    }
    if (weatherCode>=51 && weatherCode<=67) {
        return "Rain 🌧️";
    }

    if (weatherCode>=71 && weatherCode<=77) {
        return "Snow ❄️";
    }

    if (weatherCode>=80 && weatherCode<=82) {
        return "Rain Showers ☔"
    }

    if (weatherCode>=95) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown Weather";
}


function applyWeatherTheme(weatherCode,isDay) {
    const root = document.documentElement;

    // Default theme
    root.style.setProperty("--bg-color", "#EAF4FB");
    root.style.setProperty("--forecast-color", "#CFE8F5");
    root.style.setProperty("--card-color", "#FFFFFF");
    root.style.setProperty("--text-color", "#243B53");
    root.style.setProperty("--border-color", "#D5E5EF");
    root.style.setProperty("--accent-color", "#397DA8");

    //Night Theme
    if (isDay === 0) {
        root.style.setProperty("--bg-color", "#172B42");
        root.style.setProperty("--forecast-color", "#29445F");
        root.style.setProperty("--card-color", "#223A52");
        root.style.setProperty("--text-color", "#F0F5FA");
        root.style.setProperty("--border-color", "#45627D");
        root.style.setProperty("--accent-color", "#6FAED6");
    }

    //Day Theme
    else {
        if (weatherCode === 0) {
            root.style.setProperty("--bg-color", "#EAF4FB");
            root.style.setProperty("--forecast-color", "#CFE8F5");
        }

        else if (weatherCode === 1 || weatherCode === 2) {
            root.style.setProperty("--bg-color", "#E6F1F8");
            root.style.setProperty("--forecast-color", "#D5EAF5");
        }

        else if (weatherCode === 3) {
            root.style.setProperty("--bg-color", "#E3E9EE");
            root.style.setProperty("--forecast-color", "#CCD7DF");
        }

        else if (weatherCode === 45 || weatherCode === 48) {
            root.style.setProperty("--bg-color", "#E6EBEE");
            root.style.setProperty("--forecast-color", "#D1DADF");
        }

        else if (weatherCode >= 51 && weatherCode <= 67) {
            root.style.setProperty("--bg-color", "#DCEAF3");
            root.style.setProperty("--forecast-color", "#BFD9E8");
        }

        else if (weatherCode >= 71 && weatherCode <= 77) {
            root.style.setProperty("--bg-color", "#EEF5F8");
            root.style.setProperty("--forecast-color", "#DCEBF1");
        }

        else if (weatherCode >= 80 && weatherCode <= 82) {
            root.style.setProperty("--bg-color", "#D5E7F0");
            root.style.setProperty("--forecast-color", "#B8D3E1");
        }

        else if (weatherCode >= 95) {
            root.style.setProperty("--bg-color", "#D7E1EA");
            root.style.setProperty("--forecast-color", "#B8C9D8");
        }
    }
}
