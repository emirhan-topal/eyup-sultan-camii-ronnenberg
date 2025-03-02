"use client";

import {useEffect, useState} from "react";
import styles from '../page.module.css'

export default function ezanVakitleri(){
    const [vakitler, setVakitler] = useState([])

    async function getData() {
        const vakitlerFetch = await fetch('https://ezanvakti.emushaf.net/vakitler/11013')
        const vakitlerResponse = await vakitlerFetch.json()
        setVakitler(vakitlerResponse)
        localStorage.setItem("ezan-vakitleri",JSON.stringify(vakitlerResponse))
    }

    useEffect(() => {
        getData()

        setInterval(getData,3600000)
    },[])

    return (
        <>
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
        </>
    )
}