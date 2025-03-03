"use client";

import {useEffect, useState} from "react";
import styles from '../page.module.css'

export default function ezanVakitleri(){
    const [vakitler, setVakitler] = useState([])

    async function getData() {
        try{
            const vakitlerFetch = await fetch('https://ezanvakti.emushaf.net/vakitler/11013')
            const vakitlerResponse = await vakitlerFetch.json()
            setVakitler(vakitlerResponse)
            localStorage.setItem("ezan-vakitleri",JSON.stringify(vakitlerResponse))
        }
        catch(err){
            setVakitler({response:"error"})
        }
    }

    useEffect(() => {
        getData()

        setInterval(getData,3600000)
    },[])

    if(vakitler.response){
        return (
            <h1>Hata, lütfen tekrar deneyin.</h1>
        )
    }
    else{
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
}