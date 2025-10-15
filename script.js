function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user === "admin" && pass === "1234") {
        localStorage.setItem("loggedIn", true);
        window.location.href = "index.html";
    } else {
        document.getElementById("error").innerText = "Username หรือ Password ไม่ถูกต้อง";
    }
}
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}
function checkLogin() {
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "login.html";
    }
}
checkLogin();
function toggleTheme() {
    document.body.classList.toggle("light-theme");
}
async function loadMovies() {
    const res = await fetch("playlist.json");
    const movies = await res.json();
    const container = document.getElementById("movieContainer");
    container.innerHTML = "";
    movies.forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie-card";
        div.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.category}</p>
            <button onclick="playMovie('${movie.title}', '${movie.url}', '${movie.type}')">ดูหนัง</button>
        `;
        container.appendChild(div);
    });
}
function searchMovies() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".movie-card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(input) ? "block" : "none";
    });
}
function playMovie(title, url, type) {
    localStorage.setItem("movieTitle", title);
    localStorage.setItem("movieURL", url);
    localStorage.setItem("movieType", type);
    window.location.href = "player.html";
}
function goBack() {
    window.location.href = "index.html";
}
window.onload = function() {
    if (window.location.pathname.endsWith("index.html")) {
        loadMovies();
    }
    if (window.location.pathname.endsWith("player.html")) {
        const title = localStorage.getItem("movieTitle");
        const url = localStorage.getItem("movieURL");
        const type = localStorage.getItem("movieType");
        document.getElementById("movieTitle").innerText = title;
        const container = document.getElementById("videoContainer");
        if (type === "m3u8") {
            container.innerHTML = `<video controls autoplay style="width:100%"><source src="${url}" type="application/x-mpegURL"></video>`;
        } else if (type === "iframe") {
            container.innerHTML = `<iframe src="${url}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
        }
    }
};