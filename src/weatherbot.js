import React, { useEffect, useState, useRef } from "react";
import './weatherbot.css';
import { WeatherIcons } from "./App.js";



function WeatherInfoContainer({ weatherInfo }) {
    return (
        <div className="container">
            <div className="main">
                <h1>{weatherInfo.name}</h1>
                <h2>{weatherInfo.temp}°C | {weatherInfo.description}</h2>
                {console.log(WeatherIcons[weatherInfo.icon])}
                <img src={WeatherIcons[weatherInfo.icon]} style={{ width: '100px', height: '100px' }} alt={WeatherIcons[weatherInfo.icon]} />
            </div>
            <div className="sub">
                <ul>
                    <li>
                        Max Temp: {weatherInfo.tempMax}°C
                    </li>
                    <li>
                        Min Temp: {weatherInfo.tempMin}°C
                    </li>
                    <li>
                        Humidity: {weatherInfo.humidity}
                    </li>
                </ul>
            </div>
        </div>
    )
}
function SearchBar({ inputRef, handButton }) {
    return (
        <div>
            <div>
                <h1>React Weather App</h1>
            </div>
            <div class="searchForm">
                <input ref={inputRef} type="text" id="city" placeholder="City,Country(Optional)" />
                <button onClick={handButton}>Search</button>
            </div>
        </div>
    )
}
export default function WeatherBot() {
    const [cityUpdated, setCityUpdated] = useState('');
    const [weatherInfo, setWeatherInfo] = useState({ temp: null, tempMax: null, tempMin: null, humidity: null, description: null, name: null, icon: null });
    const inputRef = useRef(null);

    console.log(weatherInfo);
    useEffect(() => {
        if (cityUpdated !== "") {
            fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityUpdated}&units=metric&&appid=bdc3bda442d3f588dafbc64838bf2baf`)
                .then(res => res.json())
                .then(data => {
                    let lat = null;
                    let lon = null;
                    data.forEach(pre => {
                        lat = pre.lat;
                        lon = pre.lon;
                    })
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=bdc3bda442d3f588dafbc64838bf2baf`)
                        .then(res => res.json())
                        .then(weatherData => {
                            console.log("new data");
                            console.log(weatherData);
                            updateWeather(weatherData);
                        })

                })
        } else {
            navigator.geolocation.getCurrentPosition((pos) => {
                const latLong = { lat: pos.coords.latitude, long: pos.coords.longitude };
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latLong.lat}&lon=${latLong.long}&units=metric&appid=bdc3bda442d3f588dafbc64838bf2baf`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        updateWeather(data)
                    })
            })

        }

    }, [cityUpdated])


    function handleButton() {
        setCityUpdated(inputRef.current.value);
    }

    function updateWeather(data) {
        const main = data.main;
        const weatherDescription = data.weather[0].description;
        const weatherIcon = data.weather[0].icon;
        const weatherData = { temp: main.temp, tempMax: main.temp_max, tempMin: main.temp_min, humidity: main.humidity, description: weatherDescription, name: data.name + ", " + data.sys.country, icon: weatherIcon };
        console.log(weatherData);
        setWeatherInfo(weatherData);
    }

    return (
        <>
            <SearchBar inputRef={inputRef} handButton={handleButton} />
            <WeatherInfoContainer weatherInfo={weatherInfo} />
        </>
    )

}