"use client"

import {useState, useEffect} from 'react'
import styles from '../page.module.css'

export default function GununTarihi(){
    const [miladiTakvim,setMiladiTakvim] = useState("")
    const [hicriTakvim,setHicriTakvim] = useState("")

    function getData(){
        const vakitler = JSON.parse(localStorage.getItem("ezan-vakitleri"))
        const nowVakit = vakitler.find(vakit => vakit.MiladiTarihKisa == new Date().toLocaleDateString("tr-TR"))

        setMiladiTakvim(nowVakit.MiladiTarihUzun)
        setHicriTakvim(nowVakit.HicriTarihUzun)
    }

    useEffect(() => {
        getData()

        setInterval(getData,3600000)
    },[])

    return(
        <div className={styles.toolDiv}>
            <span>{miladiTakvim ? miladiTakvim : "Yükleniyor..."}</span>
            <br></br>
            <span>{hicriTakvim ? hicriTakvim : "Yükleniyor..."}</span>
        </div>
    )
}