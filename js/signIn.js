import { checkCookie } from "../utils/cookies.js";
import {cookieCheckApi, loginApi} from "./endpoints.js";

const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", async () => {
    form.reset();
    const { statusCode } = await checkCookie(cookieCheckApi)
    
    if (statusCode === 200) {
        alert("Cookie exists");
        window.location.href = "http://127.0.0.1:5501/index.html";
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const data = {
        email,
        password,
    };

    console.log(data);
    const {statusCode, resData} = await signIn(loginApi, data);

    if (statusCode === 200) {
        alert("Sign in successful");
        window.location.href = "http://127.0.0.1:5501/index.html";
    } else {
        alert("Sign in failed. Check console for more information");
        console.log(resData)
    }
});

async function signIn(api, data) {
    const res = await fetch(api, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const resData = await res.json();
    console.log(resData);
    if (res.status === 200) {
        return { statusCode: 200, resData };
    } else {
        return { statusCode: res.status, resData };
    }
}


