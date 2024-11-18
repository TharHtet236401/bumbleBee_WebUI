import { checkCookie } from "../utils/cookies.js";

let token;

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode, resData } = await checkCookie("http://127.0.0.1:3000/api/cookie/check");
    console.log(statusCode)
    if (statusCode !== 200) {
        alert("Please sign in first");
        window.location.href = "http://127.0.0.1:5501/signIn.html";
    }
    token = resData.token;
    console.log(token);
    await getConversatinList(token);
})

async function getConversatinList(token) {
    const api = `http://127.0.0.1:3000/api/conversation/all`;
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
