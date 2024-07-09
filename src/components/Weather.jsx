import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import drizzle_icon from '../assets/drizzle.png'
import BounceLoader from "react-spinners/BounceLoader";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({

    disable: false,
    startEvent: 'DOMContentLoaded',
    initClassName: 'aos-init',
    animatedClassName: 'aos-animate',
    useClassNames: false,
    disableMutationObserver: false,
    debounceDelay: 50,
    throttleDelay: 99,


    offset: 120,
    delay: 0,
    duration: 400,
    easing: 'ease',
    once: false,
    mirror: false,
    anchorPlacement: 'top-bottom',

});

var currentdate = new Date();
var datetime = currentdate.getDay() + "/" + currentdate.getMonth()
    + "/" + currentdate.getFullYear();

let datetime2 = + currentdate.getHours() + " : "
    + currentdate.getMinutes() + " : " + currentdate.getSeconds();

const Weather = () => {
    const [weatherData, setWeatherData] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13": snow_icon,
    }

    const inputRef = useRef();

    const search = async (city) => {
        if (!city) {
            setError(true);
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            const data = await response.json();
            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                temperature: Math.floor(data.main.temp),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                location: data.name,
                icon: icon,
                status: data.weather[0].main,
                country: data.sys.country,
                pressure: data.main.pressure
            })
            setError(false);
        }
        catch {

        }
    }

    useEffect(() => {
        search("Pimpri-chinchwad");
        setLoading(true)
        setTimeout(() => {
            setLoading(false);
        }, 4000);
    }, [])



    return (
        <>
            {loading ? (<BounceLoader color="#09366ae0" className='clip' size={250} />) :
                (
                    <>
                        <div className='weather' data-aos="fade-right" data-aos-delay="1000" data-aos-duration="15000" data-aos-easing="ease-in-out">

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    Please enter valid city name!
                                </div>
                            )}
                            <div className="search-bar">
                                <input ref={inputRef} type="text" placeholder='Search' />
                                <img src={search_icon} alt="" onClick={() => { search(inputRef.current.value) }} />
                            </div>


                            <img src={weatherData.icon} alt="" className='weather-icon' />
                            <p className="temperature">{weatherData.temperature}&deg;c</p>
                            <p className="location">{weatherData.location}</p>

                            <div className="weather-data">

                                <div className="col">
                                    <img src={humidity_icon} alt="" />
                                    <div>
                                        <p> {weatherData.humidity} </p>
                                        <span>Humidity</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <img src={wind_icon} alt="" />
                                    <div>
                                        <p>{weatherData.windSpeed}km/hr </p>
                                        <span>Wind Speed</span>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className='weather2' data-aos="fade-left" data-aos-delay="1000" data-aos-duration="15000" data-aos-easing="ease-in-out">

                            <img src={weatherData.icon} alt="" className='weather2-icon' />


                            <p className="weather2temperature">{weatherData.status}</p>
                            <hr className='line' /> <br />
                            <p className="weather2location">{weatherData.location},{weatherData.country}</p>
                            <hr className='line2' />
                            <p className="weather2Info">Temperture : {weatherData.temperature}&deg;c</p>
                            <p className="weather2Info">Humidity : {weatherData.humidity}%</p>
                            <p className="weather2Info">Pressure : {weatherData.pressure} in</p>
                            <p className="weather2Info">Time - {datetime2}</p>
                            <p className="weather2Info">Date - {datetime}</p>


                        </div>
                    </>

                )}
        </>)
}

export default Weather
