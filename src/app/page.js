"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [vakitler, setVakitler] = useState([])
  const [weatherData, setWeatherData] = useState([])
  const [remainingClock,setRemainingClock] = useState("")
  const [nowVakit,setNowVakit] = useState("")
  const [nowClock,setNowClock] = useState("")
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
  }

  //kalan vakit hesaplama fonksiyonu
  function calculateTimeDifference(time1, time2) {
    // Şu anki tarih bilgisi
    const currentDate = new Date();
    
    // Verilen saati günün o saatine dönüştür
    const time1Parts = time1.split(':');
    const date1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time1Parts[0], time1Parts[1]);
    
    // Diğer saati günün o saatine dönüştür
    const time2Parts = time2.split(':');
    const date2 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time2Parts[0], time2Parts[1]);
    
    // Eğer time2, time1'den önceyse, time2'yi bir gün sonrasına al
    if (date2 < date1) {
        date2.setDate(date2.getDate() + 1);
    }
    
    // Tarihler arasındaki farkı milisaniye cinsinden hesapla
    const diffInMillis = date2 - date1;
    
    // Milisaniyeyi saat ve dakikaya dönüştür
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffInHours} saat ${diffInMinutes} dakika ${new Date().getSeconds()} saniye`;
  }

  //namaz vakitlerine kalan zamanı ve hangi vakitte olduğumuzu hesapla
  function calculateRemainingPrayerTime() {
      const date = new Date()
      const clock = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')
      const nowVakit = vakitler.find(vakit => vakit.MiladiTarihKisa === new Date().toLocaleDateString("tr-TR"))

      setNowClock(date.getHours() + " saat " + date.getMinutes() + " dakika " + date.getSeconds() +" saniye ")

      if (clock >= nowVakit.Imsak && clock < nowVakit.Gunes) {
          const difference = calculateTimeDifference(clock, nowVakit.Gunes)
          setRemainingClock(difference)
          setNowVakit("Sabah")
          return
      }
      else if (clock >= nowVakit.Gunes && clock < nowVakit.Ogle) {
          const difference = calculateTimeDifference(clock, nowVakit.Ogle)
          setRemainingClock(difference)
          setNowVakit("Güneş")
      }
      else if (clock >= nowVakit.Ogle && clock < nowVakit.Ikindi) {
          const difference = calculateTimeDifference(clock, nowVakit.Ikindi)
          setRemainingClock(difference)
          setNowVakit("Öğle")
      }
      else if (clock >= nowVakit.Ikindi && clock < nowVakit.Aksam) {
          const difference = calculateTimeDifference(clock, nowVakit.Aksam)
          setRemainingClock(difference)
          setNowVakit("İkindi")
          return
      }
      else if (clock >= nowVakit.Aksam && clock < nowVakit.Yatsi) {
          const difference = calculateTimeDifference(clock, nowVakit.Yatsi)
          setRemainingClock(difference)
          setNowVakit("Akşam")
          return
      }
      else {
          const tomorrowDate = new Date()
          tomorrowDate.setDate(tomorrowDate.getDate() + 1)
          const tomorrowVakit = vakitler.find(vakit => vakit.MiladiTarihKisa === tomorrowDate.toLocaleDateString("tr-TR"))
          const difference = calculateTimeDifference(clock, tomorrowVakit.Imsak)
          setRemainingClock(difference)
          setNowVakit("Yatsı")
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
      setInterval(calculateRemainingPrayerTime, 1000);
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

      {/* Miladi ve Hicri Takvim */}
      <div className={styles.toolDiv}>
        <span>{vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).MiladiTarihUzun : "Yükleniyor..."}</span>
        <br></br>
        <span>{vakitler.length !== 0 ? vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR")).HicriTarihUzun : "Yükleniyor..."}</span>
      </div>

      <br></br>

      {/* Şu Anki ve Sonraki Vakite Kalan Saat */}
      <div className={styles.toolDiv}>
        <span>{remainingClock ? remainingClock : "Yükleniyor..."}</span>
        <br></br>
        <span>{nowClock ? nowClock : "Yükleniyor..."}</span>
      </div>

      <br></br>

      {/* Şu anki vakit */}
      <div className={styles.toolDiv}> <span>{nowVakit ? nowVakit : "Yükleniyor..."}</span> </div>

      {/* Günlük hadis ve detayları */}

      <div className={styles.toolDiv}>
        
      <span>{selectedHadits ? selectedHadits.text :  "Yükleniyor..."}</span>
        <br></br>
        <br></br>
        <span>Hadis Numarası: {selectedHadits ? selectedHadits.hadithnumber :  "Yükleniyor..."} Kitap: {hadits.metadata ? hadits.metadata.name : "Yükleniyor..."}</span>
      </div>
    </>
  );
}
