export async function checkCookie(api) {
    const res = await fetch(api, {
        method: "GET",
        credentials: 'include', 
        headers: {
            "Content-Type": "application/json",
        },
          // This allows the browser to send the cookies
    });
    
    if (res.status === 200) {
        console.log("Cookie exists");
        const resData = await res.json();
        return { statusCode: 200, resData };
    } else if (res.status === 401) {
        return { statusCode: 401 };
    }
}
