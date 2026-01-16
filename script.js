function rate(stars) {
    let allStars = document.querySelectorAll(".stars span");
    allStars.forEach((star, index) => {
        star.classList.toggle("active", index < stars);
    });
    document.getElementById("rating-text").innerText =
        "You rated " + stars + " stars";
}

function submitComment() {
    let comment = document.getElementById("commentBox").value;
    if (comment === "") {
        alert("Please write a comment");
        return;
    }
    localStorage.setItem("userComment", comment);
    document.getElementById("saved-comment").innerText =
        "Saved comment: " + comment;
    document.getElementById("commentBox").value = "";
}

function addToCart(product) {
    alert(product + " added to cart (demo)");
}

/* Load saved comment */
window.onload = function () {
    let saved = localStorage.getItem("userComment");
    if (saved) {
        document.getElementById("saved-comment").innerText =
            "Saved comment: " + saved;
    }
};
