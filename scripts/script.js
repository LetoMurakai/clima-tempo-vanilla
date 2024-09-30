lucide.createIcons();
const bgState = document.querySelector(".weather-app");
const searchInput = document.querySelector("#search-input");
const currentWeather = document.querySelector(".current-weather");
const hourlyWeatherList = document.querySelector(".weather-list");
const API_KEY = "e0600321d5584db695d234210242209 ";

const description_location = {};

const weatherCodes = {
	sun: [1000, 1003],
	partial_cloudy: [1003, 1006, 1009],
	mostly_cloud: [1030, 1135, 1147],
	rain: [
		1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246,
		1273, 1276,
	],
	heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
	snow: [
		1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222,
		1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282,
	],
	heavy_thunder: [1087, 1279, 1282],
	thunder: [1273, 1279],
};

const displayHourlyForecast = (hourlyData) => {
	const currentHour = new Date().setMinutes(0, 0, 0);
	const next24Hours = currentHour + 24 * 60 * 60 * 1000;

	const next24HoursData = hourlyData.filter(({ time }) => {
		const forecastTime = new Date(time).getTime();
		return forecastTime >= currentHour && forecastTime <= next24Hours;
	});

	hourlyWeatherList.innerHTML = next24HoursData
		.map((item) => {
			const temperature = item.temp_c.toFixed(0);
			const time = item.time.split(" ")[1].substring(0, 5);
			const isDay = item.is_day;
			const weatherIcon = Object.keys(weatherCodes).find((key) =>
				weatherCodes[key].includes(item.condition.code),
			);

			return `
		 <li class="weather-item">
			<p class="time">${time}</p>
			<img src="${`./assets/img/${weatherIcon}_${isDay ? "light" : "night"}.svg`}" alt="" class="weather-icon">
			<p class="temperature">${temperature}<span>º</span></p>
		</li>
		`;
		})
		.join("");
};

const getWeatherDetail = async (cityName) => {
	const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2&lang=pt`;

	try {
		const data = await fetch(apiUrl).then((response) => response.json());
		const temperature = data.current.temp_c.toFixed(0);
		const description = data.current.condition.text;
		const cityName = data.location.region;
		const isDay = data.current.is_day;
		const weatherIcon = Object.keys(weatherCodes).find((key) =>
			weatherCodes[key].includes(data.current.condition.code),
		);
		bgState.style.background = isDay
			? "linear-gradient(0deg, rgba(45,210,253,1) 60%, rgba(45,203,253,1) 100%)"
			: "linear-gradient(0deg, rgba(15,56,94,1) 60%, rgba(31,54,75,1) 100%)";

		currentWeather.querySelector(".temperature").innerHTML =
			`${temperature}<span>ºC</span>`;
		currentWeather.querySelector(".description").textContent = description;
		currentWeather.querySelector(".city-name").textContent = cityName;
		currentWeather.querySelector(".weather-icon").src =
			`./assets/img/${weatherIcon}_${isDay ? "light" : "night"}.svg`;

		const combinedHourlyData = [
			...data.forecast.forecastday[0].hour,
			...data.forecast.forecastday[1].hour,
		];

		displayHourlyForecast(combinedHourlyData);
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
