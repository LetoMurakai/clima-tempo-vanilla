lucide.createIcons();
const searchInput = document.querySelector("#search-input");
const currentWeather = document.querySelector(".current-weather");
const API_KEY = "e0600321d5584db695d234210242209 ";

const weatherCodes = {
	sun_light: [1000],
	partial_cloudy_light: [1003, 1006, 1009],
	mostly_cloud_light: [1030, 1135, 1147],
	rainyday_light: [1063],
	heavy_rain_light: [1186],
	snow_light: [1066],
	thunder: [1087, 1279, 1282],
	thunder_light: [1273, 1279],
};

const getWeatherDetail = async (cityName) => {
	const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}`;

	try {
		const data = await fetch(apiUrl).then((response) => response.json());
		const temperature = data.current.temp_c.toFixed(0);
		const description = data.current.condition.text;
		const cityName = data.location.region;
		const isDay = data.current.is_day;
		const weatherIcon = Object.keys(weatherCodes).find((key) =>
			weatherCodes[key].includes(data.current.condition.code),
		);

		currentWeather.querySelector(".temperature").innerHTML =
			`${temperature}<span>ºC</span>`;
		currentWeather.querySelector(".description").textContent = description;
		currentWeather.querySelector(".city-name").textContent = cityName;
		currentWeather.querySelector(".weather-icon").src =
			`./assets/img/${weatherIcon}.svg`;
	} catch (error) {
		alert(error);
	}
};

searchInput.addEventListener("keyup", (e) => {
	const cityName = searchInput.value.trim();

	if (e.key === "Enter" && cityName) {
		getWeatherDetail(cityName);
	}
});
