"use client"

import { useState, useEffect } from "react"
import styles from '../page.module.css'

export default function GunlukHadis(){

    const [hadisler,setHadisler] = useState([])
    const [selectedHadis,setSelectedHadis] = useState([])

    async function getData() {
        const haditsFetch = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/tur-bukhari/sections/0.min.json')
        const haditsResponse = await haditsFetch.json()
        setHadisler(haditsResponse)

        const nowDate = new Date()
        const day = nowDate.getDate()
        const month = nowDate.getMonth()
        const hadithNumber = (day + month) % haditsResponse.hadiths.length

        setSelectedHadis(haditsResponse.hadiths[hadithNumber])
    }

    useEffect(() => {
        getData()
        setInterval(getData, 3600000);
    },[])

    useEffect(() => {
        if(hadisler.length !== 0) {
            console.log(selectedHadis);
        }
    },[hadisler])

    return (
        <div className={styles.toolDiv}>
            <span>{selectedHadis ? selectedHadis.text :  "Yükleniyor..."}</span>
            <br></br>
            <br></br>
            <span>Hadis Numarası: {selectedHadis ? selectedHadis.hadithnumber :  "Yükleniyor..."} Kitap: {hadisler.metadata ? hadisler.metadata.name : "Yükleniyor..."}</span>
        </div>
    )
}