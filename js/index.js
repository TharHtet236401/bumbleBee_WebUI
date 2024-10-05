import { checkCookie } from "../utils/cookies.js";

const body = document.body
const moreOptionsBtns = document.querySelectorAll(".more_options");
const optionsModalBoxes = document.querySelectorAll(".options_modalBox");


moreOptionsBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        optionsModalBoxes[i].classList.toggle("display_none");
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode, resData } = await checkCookie("http://127.0.0.1:3000/api/cookie/check")
    console.log(resData.userData)
    if (statusCode != 200) {
        alert("Cookie does not exist. Redirecting to sign in page");
        window.location.href = "http://127.0.0.1:5501/pages/signIn.html";
    }
});


