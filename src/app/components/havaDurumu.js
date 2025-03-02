"use client"

import {useState,useEffect} from 'react'
import styles from '../page.module.css'

export default function HavaDurumu(){
    const [nowVakit,setNowVakit] = useState([])
    const [weatherData,setWeatherData] = useState([])

    async function getData() {
        const vakitler = JSON.parse(localStorage.getItem("ezan-vakitleri"))

        setNowVakit(vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")))

        const weatherFetch = await fetch('https://api.weatherapi.com/v1/current.json?key=2c6975609a6b4779a1094156240911&q=GERMANY NIEDERSACHSEN HANNOVER&aqi=no')
        const weatherResponse = await weatherFetch.json()
        setWeatherData(weatherResponse)
    }

    useEffect(() => {
        getData()

        setInterval(getData,3600000)
    },[])

    return(
        <div className={styles.toolDiv}>
            <img src={nowVakit ? nowVakit.AyinSekliURL : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500"}></img>

            <br></br>

            <img src="https://png.pngtree.com/png-vector/20220705/ourmid/pngtree-sun-icon-logo-png-png-image_5687131.png" width={100} height={100}></img>
                <span>{nowVakit ? nowVakit.GunesDogus : "Yükleniyor..."}</span>
            <br></br>

            <img src="https://cdn-icons-png.freepik.com/512/12609/12609946.png?ga=GA1.1.1959818392.1740777294" width={75} height={75}></img>
            <span>{nowVakit ? nowVakit.GunesBatis : "Yükleniyor..."}</span>

            <br></br>

            <img src={weatherData.length !== 0 ? weatherData.current.condition.icon : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500"}></img>
            <span>{weatherData.length !== 0 ? weatherData.current.temp_c + "°C" : "Yükleniyor..."}</span>
        </div>
    )
}