const apiKey = 'b6bd1f0b91msh5052361720f36eap17ff85jsn6603419d5f9d';
const apiHost = 'weatherapi-com.p.rapidapi.com';

// Function to fetch weather data by location
async function fetchWeather(query, elementIdPrefix, isForecast = false) {
    const url = `https://weatherapi-com.p.rapidapi.com/${isForecast ? 'forecast.json' : 'current.json'}?q=${query}&days=7`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (isForecast) {
            displayForecast(result);
        } else if (elementIdPrefix) {
            document.getElementById(`${elementIdPrefix}-temp`).textContent = `${result.current.temp_c}°C`;
            document.getElementById(`${elementIdPrefix}-condition`).textContent = `${result.current.condition.text}`;
        } else {
            document.getElementById('location').textContent = `Location: ${result.location.name}, ${result.location.country}`;
            document.getElementById('temperature').textContent = `Temperature: ${result.current.temp_c}°C`;
            document.getElementById('condition').textContent = `Condition: ${result.current.condition.text}`;
        }
    } catch (error) {
        console.error(error);
        alert('Error fetching weather data');
    }
}

// Function to display 7-day forecast
function displayForecast(result) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    const forecastDays = result.forecast.forecastday;
    forecastDays.forEach(day => {
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-day');
        forecastDiv.innerHTML = `
            <p><strong>${new Date(day.date).toLocaleDateString()}</strong></p>
            <p>${day.day.avgtemp_c}°C</p>
            <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(forecastDiv);
    });
}

// Fetch default weather for major cities
function fetchDefaultWeatherForCities() {
    const cities = [
        { name: 'Kolkata', query: 'Kolkata', elementId: 'kolkata' },
        { name: 'Delhi', query: 'Delhi', elementId: 'delhi' },
        { name: 'Mumbai', query: 'Mumbai', elementId: 'mumbai' },
        { name: 'Bengaluru', query: 'Bengaluru', elementId: 'bengaluru' }
    ];

    cities.forEach(city => {
        fetchWeather(city.query, city.elementId);
    });
}

// Event listener for search button
document.getElementById('searchWeather').addEventListener('click', () => {
    const searchLocation = document.getElementById('searchLocation').value;
    if (searchLocation) {
        fetchWeather(searchLocation); // Fetch current weather
        fetchWeather(searchLocation, null, true); // Fetch 7-day forecast
    } else {
        alert('Please enter a location');
    }
});

// Event listener for current location button
document.getElementById('getCurrentLocationWeather').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(`${lat},${lon}`); // Fetch current weather
            fetchWeather(`${lat},${lon}`, null, true); // Fetch 7-day forecast
        }, error => {
            alert('Unable to retrieve your location');
            console.error(error);
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

// Automatically fetch weather for current location and major cities on page load
window.onload = function() {
    fetchDefaultWeatherForCities();
};
