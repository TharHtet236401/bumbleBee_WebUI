const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", async () => {
    // form.reset();
    const data = await checkCookie("http://localhost:3000/api/cookie/check")
    console.log(data)
});

async function checkCookie(api) {
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'  // Important for sending cookies
    });
    console.log(res.status);
    
    if (res.status === 200) {
        console.log("Cookie exists");
        const resData = await res.json();
        return { statusCode: 200, resData };
    } else if (res.status === 401) {
        return { statusCode: 401 };
    }
}
