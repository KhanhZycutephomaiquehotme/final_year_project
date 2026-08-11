document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    registerBtn.addEventListener("click", function (e) {
        e.preventDefault();

        container.classList.add("active");
    });

    loginBtn.addEventListener("click", function (e) {
        e.preventDefault();

        container.classList.remove("active");
    });

});