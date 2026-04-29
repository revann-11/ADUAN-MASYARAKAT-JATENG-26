document.getElementById("formAduan").addEventListener("submit", function(e) {
    e.preventDefault();

    document.querySelector(".form-box").innerHTML = `
        <h2 style="color: lightgreen;">✅ TERIMAKASIH</h2>
        <p>Aduan anda sudah kami terima 🙏</p>
        <br>
        <button onclick="location.reload()">Kirim Lagi</button>
    `;
});