"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [vakitler, setVakitler] = useState([])
  const [weatherData, setWeatherData] = useState([])
  const [remainingClock,setRemainingClock] = useState([]);
  const [hadits,setHadits] = useState([])
  const [selectedHadits,setSelectedHadits] = useState([])

  async function getData() {
    const vakitlerFetch = await fetch('https://ezanvakti.emushaf.net/vakitler/11013')
    const vakitlerResponse = await vakitlerFetch.json()
    setVakitler(vakitlerResponse)

    const weatherFetch = await fetch('https://api.weatherapi.com/v1/current.json?key=2c6975609a6b4779a1094156240911&q=GERMANY NIEDERSACHSEN HANNOVER&aqi=no')
    const weatherResponse = await weatherFetch.json()
    setWeatherData(weatherResponse)

    const haditsFetch = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/tur-bukhari/sections/0.min.json')
    const haditsResponse = await haditsFetch.json()
    setHadits(haditsResponse)

    const nowDate = new Date()
    const day = nowDate.getDate()
    const month = nowDate.getMonth()
    const hadithNumber = (day + month) % haditsResponse.hadiths.length

    setSelectedHadits(haditsResponse.hadiths[hadithNumber])
    console.log(haditsResponse.hadiths[hadithNumber],haditsResponse);
  }

  function calculateTimeDifference(time1, time2) {
    // Şu anki tarih bilgisi
    const currentDate = new Date();
  
    // Bugün saat 20:00
    const time1Parts = time1.split(':');
    const date1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time1Parts[0], time1Parts[1]);
  
    // Yarın saat 06:00
    const time2Parts = time2.split(':');
    const date2 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, time2Parts[0], time2Parts[1]);
  
    // Tarihler arasındaki farkı milisaniye cinsinden hesapla
    const diffInMillis = date2 - date1;
  
    // Milisaniyeyi saat ve dakikaya dönüştür
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${diffInHours} saat ${diffInMinutes} dakika`;
  }

  function calculateRemainingPrayerTime(){
    const date = new Date()
    const clock = date.getHours().toString().padStart(2,'0') + "." + date.getMinutes()
    const nowVakit = vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR"))

    if(clock >= nowVakit.Imsak.replace(":",".") && clock < nowVakit.Gunes.replace(":",".")){
      const difference = calculateTimeDifference(clock.split('.')[0] + ":" + clock.split('.')[1], nowVakit.Gunes);
      setRemainingClock([difference,"Sabah"])
      return;
    }
    else if(clock >= nowVakit.Gunes.replace(":",".") && clock < nowVakit.Ogle.replace(":",".")){
      const difference = calculateTimeDifference(clock.split('.')[0] + ":" + clock.split('.')[1], nowVakit.Ogle);
      setRemainingClock([difference,"Guneş"])
      return;
    }
    else if(clock >= nowVakit.Ogle.replace(":",".") && clock < nowVakit.Ikindi.replace(":",".")){
      const difference = calculateTimeDifference(clock.split('.')[0] + ":" + clock.split('.')[1], nowVakit.Ikindi);
      setRemainingClock([difference,"Ogle"])
      return
    }
    else if(clock >= nowVakit.Ikindi.replace(":",".") && clock < nowVakit.Aksam.replace(":",".")){
      const difference = calculateTimeDifference(clock.split('.')[0] + ":" + clock.split('.')[1], nowVakit.Aksam);
      setRemainingClock([difference,"İkindi"])
      return
    }
    else if(clock >= nowVakit.Aksam.replace(":",".") && clock < nowVakit.Yatsi.replace(":",".")){
      const difference = calculateTimeDifference(clock.split('.')[0] + ":" + clock.split('.')[1], nowVakit.Yatsi);
      setRemainingClock([difference,"Akşam"])
      return
    }
    else{
      const difference = calculateTimeDifference(clock.split('.')[0] + ":" + clock.split('.')[1], "05:07");
      setRemainingClock([difference,"Yatsı"])
      return
    }
  }

  useEffect(() => {
    getData()

    //her 1 saatte 1 kez verileri güncelle
    setInterval(getData, 3600000)
  },[])

  useEffect(() => {
    if(vakitler.length !== 0){
      calculateRemainingPrayerTime()

      //her 30 saniyede 1 kalan vakiti hesapla
      setTimeout(calculateRemainingPrayerTime, 32000);
    }

  }, [vakitler])

  return (
    <>
      {/* Namaz Vakitlerini getirmek */}
      <div className={styles.toolDiv}>
        {vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).Imsak : "Yükleniyor..."}
      </div>
      <div className={styles.toolDiv}>
        {vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).Gunes : "Yükleniyor..."}
      </div>
      <div className={styles.toolDiv}>
        {vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).Ogle : "Yükleniyor..."}
      </div>
      <div className={styles.toolDiv}>
        {vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).Ikindi : "Yükleniyor..."}
      </div>
      <div className={styles.toolDiv}>
        {vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).Aksam : "Yükleniyor..."}
      </div>
      <div className={styles.toolDiv}>
        {vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).Yatsi : "Yükleniyor..."}
      </div>
      <br></br>

      {/* Ayın evresi */}
      <div className={styles.toolDiv}>
        <img src={vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).AyinSekliURL : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500"}></img>
      </div>
      <br></br>

      {/* Hava Durumu ve günün doğum/batım saati */}
      <div className={styles.toolDiv}>
        <span>
          <img src={weatherData.length !== 0 ? weatherData.current.condition.icon : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500"}></img>
          <span>{weatherData.length !== 0 ? weatherData.current.temp_c + "°C" : "Yükleniyor..."}</span>
        </span>
        <br></br>
        <span>
          <img src="https://png.pngtree.com/png-vector/20220705/ourmid/pngtree-sun-icon-logo-png-png-image_5687131.png" width={100} height={100}></img>
          <span>{vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).GunesDogus : "Yükleniyor..."}</span>
        </span>
        <br></br>
        <span>
          <img src="https://cdn-icons-png.freepik.com/512/12609/12609946.png?ga=GA1.1.1959818392.1740777294" width={75} height={75}></img>
          <span>{vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).GunesBatis : "Yükleniyor..."}</span>
        </span>
      </div>

      <br></br>

      <div className={styles.toolDiv}>
        <span>{vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).MiladiTarihUzun : "Yükleniyor..."}</span>
        <br></br>
        <span>{vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).HicriTarihUzun : "Yükleniyor..."}</span>
      </div>

      <br></br>
      
      <div className={styles.toolDiv}>
        <span>{remainingClock[0]}</span>
        <br></br>
        <span>{remainingClock[1]}</span>
      </div>

      <div className={styles.toolDiv}>
        <span>{
          selectedHadits.text
        }</span>
        <br></br>
        <br></br>
        <span>Hadis numarası: {selectedHadits.hadithnumber} Kitap: {hadits.metadata.name}</span>
      </div>
    </>
  );
}
