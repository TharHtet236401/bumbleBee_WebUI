import { checkCookie } from "../utils/cookies.js";
import {mainWebsite, getUserProfileApi, cookieCheckApi} from "./endpoints.js"

let token;

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode, resData } = await checkCookie(cookieCheckApi);
    console.log(statusCode)
    if (statusCode !== 200) {
        alert("Please sign in first");
        window.location.href = `${mainWebsite}/signIn.html`;
    }
    token = resData.token;
    console.log(token);
    await getConversatinList(token);
})

async function getConversatinList(token) {
    const api = `${mainApi}/api/conversation/all`;
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const data = await res.json();
    console.log(data)
}
