import { checkCookie } from "../utils/cookies.js";

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode } = await checkCookie("http://127.0.0.1:3000/api/cookie/check")
    
    if (statusCode != 200) {
        alert("Cookie does not exist. Redirecting to sign in page");
        window.location.href = "http://127.0.0.1:5501/pages/signIn.html";
    }
});
