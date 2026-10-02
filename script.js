const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "f39bb6e00062300cec3933f977178ce6";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city");
    }

});

async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=metric`;

    const response = await fetch(apiUrl);
    console.log(response);
    
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }
    
    return await response.json(); 
    
}

function displayWeatherInfo(data){
    const {name: city, 
            main: {temp, humidity}, weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";   
    
    const cityName = document.createElement("h1");
    const cityTemp = document.createElement("p");
    const cityHumidity = document.createElement("p");
    const weatherDesc = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityName.textContent = city;
    cityTemp.textContent = `${(temp - 273.15).toFixed(1)}℃`;
    cityHumidity.textContent = `Humidity: ${humidity}%`;
    weatherDesc.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
    
    cityName.classList.add("cityName");
    cityTemp.classList.add("cityTemp");
    cityHumidity.classList.add("cityHumidity");
    weatherDesc.classList.add("weatherDesc");
    weatherEmoji.classList.add("weatherEmoji");
    
    card.appendChild(cityName);
    card.appendChild(cityTemp);
    card.appendChild(cityHumidity);
    card.appendChild(weatherDesc);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId>=200 && weatherId<300):
            return "⛈️";
        
        case (weatherId>=300 && weatherId<400):
            return "🌧️";   
            
        case (weatherId>=500 && weatherId<600):
            return "🌧️";  
        
        case (weatherId>=600 && weatherId<700):
            return "❄️";     

        case (weatherId>=700 && weatherId<800):
            return "🌫️";
            
        case (weatherId==800):
            return "☀️";  
        
        case (weatherId>=801 && weatherId<810):
            return "☁️";  
            
        default:
            return "❓";    
    }

}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}