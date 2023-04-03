/** @format */

const card = document.querySelector('.weather-card');
const background = document.querySelector('.weather-background');

async function getWeather() {
	try {
		const position = await getCurrentPosition();
		const { latitude, longitude } = position.coords;
		const apiKey = '890ff39a7bed1099f724bab2b5b9a408';
		const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&cnt=5`;
		const response = await fetch(url);
		const data = await response.json();

		// Extract weather data and update the weather card
		updateWeatherCard(data);

		// Get a background image of the location and set it as the background of the card
		const imageUrl = await getImageUrl(latitude, longitude);
		background.style.backgroundImage = `url(${imageUrl})`;
	} catch (error) {
		console.log(error);
		alert('Error: Could not retrieve weather data.');
	}
}

function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

async function getImageUrl(latitude, longitude) {
	const accessToken =
		'pk.eyJ1Ijoic3VtYWNvIiwiYSI6ImNrbDZuNWM3cjBxcGgycXFwYTJxM3ptaWUifQ.P9CAUKxKB0931DSS4BdKqw';
	const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},12,0,60/1000x600@2x?access_token=${accessToken}`;

	return imageUrl;
}

function updateWeatherCard(data) {
	const { name: city, country } = data.city;
	const { temp: temperature, humidity } = data.list[0].main;
	const { description: weatherCondition, icon: weatherIcon } =
		data.list[0].weather[0];
	const { speed: windSpeed } = data.list[0].wind;

	card.querySelector('h2').textContent = `${city}, ${country}`;
	card.querySelector('.temperature').innerHTML = `${Math.ceil(
		temperature
	)}&deg;C`;
	card.querySelector('.weather-condition').textContent = weatherCondition;
	card.querySelector(
		'.weather-icon img'
	).src = `https://openweathermap.org/img/w/${weatherIcon}.png`;
	card.querySelector('.wind-speed').textContent = `${windSpeed} km/h`;
	card.querySelector('.humidity').textContent = `${humidity}%`;

	card.style.display = 'block';
}

getWeather();
