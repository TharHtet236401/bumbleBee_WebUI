const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", () => {
    form.reset();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const confirmedPassword = e.target.c_password.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value;
    const roles = e.target.roles.value;

    if (!isPasswordSame(password, confirmedPassword)) {
        alert("Password and Confirm Password must be same");
        return;
    }

    const data = {
        userName,
        password,
        confirmedPassword,
        email,
        phone,
        roles,
    };

    console.log(data)   

    const res = await fetch(
        "http://127.0.0.1:3000/api/auth/web/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const resData = await res.json();
    console.log(resData);
});

function isPasswordSame(password, c_password) {
    return password === c_password;
}
