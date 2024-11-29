import { checkCookie } from "../utils/cookies.js";
import {mainWebsite, cookieCheckApi, loginApi} from "./endpoints.js";

const form = document.querySelector("form");
const passwordToggles = document.querySelectorAll('.toggle_password');

passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        
        // Toggle password visibility
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.src = '../assets/images/eye.svg';
        } else {
            passwordInput.type = 'password';
            this.src = '../assets/images/eye-off.svg';
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    form.reset();
    const { statusCode } = await checkCookie(cookieCheckApi)
    
    if (statusCode === 200) {
        alert("Cookie exists");
        window.location.href = `${mainWebsite}/index.html`;
    }
});

const go_to_signUp = document.getElementById("go_to_signUp")
go_to_signUp.addEventListener("click", () => {
    window.location.href = `${mainWebsite}/signUp.html`;
})


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
        window.location.href = `${mainWebsite}/index.html`;
    } else {
        alert(resData.msg);
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


