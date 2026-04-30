document.getElementById("formAduan").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("formAduan").style.display = "none";
    document.getElementById("successMsg").style.display = "block";
});