import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// 1. TAMBAHKAN IMPORT UNTUK FIRESTORE DATABASE
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// CONFIG FIREBASE (Tetap gunakan milikmu)
const firebaseConfig = {
  apiKey: "AIzaSyCwFQjXdCCcwhgfu-wZ-JpSq1QdYaDc9Ek",
  authDomain: "aduan-masyarakat-jawa-tengah.firebaseapp.com",
  projectId: "aduan-masyarakat-jawa-tengah"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. AKTIFKAN DATABASE FIRESTORE
const db = getFirestore(app);


// ================== TOMBOL REGISTER & LOGIN ==================
document.getElementById("btnDaftar").addEventListener("click", function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Berhasil daftar"))
    .catch(err => alert(err.message));
});

document.getElementById("btnLogin").addEventListener("click", function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Login berhasil"))
    .catch(err => alert(err.message));
});

// CEK LOGIN STATUS
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("authBox").style.display = "none";
        document.querySelector(".container").style.display = "flex";
    } else {
        document.getElementById("authBox").style.display = "block";
        document.querySelector(".container").style.display = "none";
    }
});


// ================== API WILAYAH INDONESIA ==================
fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/33.json")
.then(res => res.json())
.then(data => {
    data.sort((a, b) => a.name.localeCompare(b.name));
    let kab = document.getElementById("kabupaten");
    kab.innerHTML = "<option>Pilih Kabupaten</option>";
    data.forEach(k => {
        let opt = document.createElement("option");
        opt.value = k.id;
        opt.textContent = k.name;
        kab.appendChild(opt);
    });
});

document.getElementById("kabupaten").addEventListener("change", function() {
    let id = this.value;
    let kec = document.getElementById("kecamatan");
    kec.innerHTML = "<option>Loading...</option>";

    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`)
    .then(res => res.json())
    .then(data => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        kec.innerHTML = "<option>Pilih Kecamatan</option>";
        data.forEach(d => {
            let opt = document.createElement("option");
            opt.textContent = d.name;
            kec.appendChild(opt);
        });
    });
});


// ================== PENDUKUNG FORM ==================
// PREVIEW FOTO
document.getElementById("foto").addEventListener("change", function(e){
    let file = e.target.files[0];
    let preview = document.getElementById("preview");
    if(file){
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

// AUTO SET WAKTU SEKARANG
document.getElementById("waktu").value = new Date().toISOString().slice(0,16);


// ================== 3. PROSES SIMPAN ADUAN KE DATABASE ==================
document.getElementById("formAduan").addEventListener("submit", async function(e){
    e.preventDefault();

    // Mengambil teks pilihan Kabupaten & Kecamatan (bukan ID angka-nya)
    let kabSelect = document.getElementById("kabupaten");
    let kecSelect = document.getElementById("kecamatan");
    
    let namaValue = document.getElementById("nama").value;
    let kabupatenValue = kabSelect.options[kabSelect.selectedIndex].text;
    let kecamatanValue = kecSelect.options[kecSelect.selectedIndex].text;
    let alamatValue = document.getElementById("alamat").value;
    let masalahValue = document.getElementById("masalah").value;
    let waktuValue = document.getElementById("waktu").value;

    try {
        // Mengirim data ke tabel/koleksi bernama "laporan_aduan"
        await addDoc(collection(db, "laporan_aduan"), {
            nama: namaValue,
            kabupaten: kabupatenValue,
            kecamatan: kecamatanValue,
            alamat: alamatValue,
            masalah: masalahValue,
            waktu_kejadian: waktuValue,
            waktu_dibuat: new Date().toISOString() // mencatat kapan laporan masuk
        });

        // Jika berhasil terkirim, sembunyikan form dan tampilkan pesan sukses
        document.getElementById("formAduan").style.display = "none";
        document.getElementById("successMsg").style.display = "block";
        
    } catch (error) {
        alert("Gagal mengirim aduan: " + error.message);
    }
});