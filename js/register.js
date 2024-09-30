const form = document.querySelector("form");
const rolesEl = document.getElementById("roles");
const relationship_wrapper = document.getElementById("relationship_wrapper")
document.addEventListener("DOMContentLoaded", () => {
    form.reset();
});

rolesEl.addEventListener("change", (e) => {
    const roles = e.target.value;
    if (roles === "guardian") {
        relationship_wrapper.style.display = "flex";
    } else {
        relationship_wrapper.style.display = "none";
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let data;
    const userName = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const confirmedPassword = e.target.c_password.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value;
    const roles = e.target.roles.value;
    let relationship;

    if (!isPasswordSame(password, confirmedPassword)) {
        alert("Password and Confirm Password must be same");
        return;
    }

    if (roles === "guardian") {
        relationship = e.target.relationship.value;
        data = {
            userName,
            password,
            confirmedPassword,
            email,
            phone,
            roles,
            relationship
        };
    } else {
        data = {
            userName,
            password,
            confirmedPassword,
            email,
            phone,
            roles
        };
    }

    form.reset();

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
    
    if (res.status === 200) {
        alert("Register successful");
        window.location.href = "http://127.0.0.1:5501/pages/signIn.html";
    } else if (res.status === 401) {
        alert("Register failed! Check console for more information");
        console.log(resData);
    }
});

function isPasswordSame(password, c_password) {
    return password === c_password;
}
