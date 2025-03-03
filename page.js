"use client";

import EzanVakitleri from './components/ezanVakitleri.js'
import KalanVakit from "./components/kalanVakit.js";
import HavaDurumu from "./components/havaDurumu.js";
import GununTarihi from "./components/gununTarihi.js";
import GunlukHadis from "./components/gunlukHadis.js";

export default function Home() {
    return (
        <>
            <EzanVakitleri/>
            <br></br>
            <KalanVakit/>
            <br></br>
            <HavaDurumu/>
            <br></br>
            <GununTarihi/>
            <br></br>
            <GunlukHadis/>
        </>
  );
}
