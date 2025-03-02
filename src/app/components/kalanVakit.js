"use client"

import {useEffect, useState} from 'react'
import styles from '../page.module.css'

export default function KalanVakit(){
    const [remainingClock,setRemainingClock] = useState("")
    const [nowClock,setNowClock] = useState("")
    const [nowVakit,setNowVakit] = useState("")
    const [vakitler,setVakitler] = useState([])

    function calculateTimeDifference(time1, time2) {
        const currentDate = new Date();
        
        const time1Parts = time1.split(':');
        const date1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time1Parts[0], time1Parts[1], time1Parts[2] || 0);
        
        const time2Parts = time2.split(':');
        const date2 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time2Parts[0], time2Parts[1], time2Parts[2] || 0);
        
        // Eğer date2, date1'den küçükse, date2'yi bir gün sonrasına ayarla
        if (date2 < date1) {
            date2.setDate(date2.getDate() + 1);
        }
        
        const diffInMillis = date2 - date1;
        
        const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));
        const diffInSeconds = Math.floor((diffInMillis % (1000 * 60)) / 1000);
        
        return `${diffInHours.toString().padStart(2,'0')}:${diffInMinutes.toString().padStart(2,'0')}:${diffInSeconds.toString().padStart(2,'0')}`;
    }

    function calculateRemainingPrayerTime() {
        const date = new Date()
        const clock = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0')
        const nowVakit = vakitler.find(vakit => vakit.MiladiTarihKisa === new Date().toLocaleDateString("tr-TR"))

        setNowClock(clock)

        if (clock >= nowVakit.Imsak && clock < nowVakit.Gunes) {
            const difference = calculateTimeDifference(clock, nowVakit.Gunes + ":00")
            setRemainingClock(difference)
            setNowVakit("Sabah")
            return
        }
        else if (clock >= nowVakit.Gunes && clock < nowVakit.Ogle) {
            const difference = calculateTimeDifference(clock, nowVakit.Ogle + ":00")
            setRemainingClock(difference)
            setNowVakit("Güneş")
        }
        else if (clock >= nowVakit.Ogle && clock < nowVakit.Ikindi) {
            const difference = calculateTimeDifference(clock, nowVakit.Ikindi + ":00")
            setRemainingClock(difference)
            setNowVakit("Öğle")
        }
        else if (clock >= nowVakit.Ikindi && clock < nowVakit.Aksam) {
            const difference = calculateTimeDifference(clock, nowVakit.Aksam + ":00")
            setRemainingClock(difference)
            setNowVakit("İkindi")
            return
        }
        else if (clock >= nowVakit.Aksam && clock < nowVakit.Yatsi) {
            const difference = calculateTimeDifference(clock, nowVakit.Yatsi + ":00")
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
        setVakitler(JSON.parse(localStorage.getItem("ezan-vakitleri")))
    },[])

    useEffect(() => {
        if(vakitler.length !== 0){
            calculateRemainingPrayerTime()

            setInterval(calculateRemainingPrayerTime,1000)
        }
    },[vakitler])

    return(
        <div className={styles.toolDiv}>
            <span>Sonraki Vakite Kalan Süre: {remainingClock ? remainingClock : "Yükleniyor..."}</span>
            <br></br>
            <span>Şimdiki Saat: {nowClock ? nowClock : "Yükleniyor..."}</span>
            <br></br>
            <span>Şimdiki Vakit: {nowVakit ? nowVakit : "Yükleniyor..."}</span>
        </div>
    )
}