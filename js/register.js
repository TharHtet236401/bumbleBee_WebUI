import { mainWebsite, registerApi, createSchoolApi}  from "./endpoints.js";
const form = document.querySelector("form");
const rolesEl = document.getElementById("roles");
const relationship_wrapper = document.getElementById("relationship_wrapper")
const school_register_form = document.getElementById("school_register_form");
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

document.addEventListener("DOMContentLoaded", () => {
    form.reset();
});


rolesEl.addEventListener("change", (e) => {
    const roles = e.target.value;
    if (roles === "guardian") {
        school_register_form.style.display = "none";
        relationship_wrapper.style.display = "flex";
    } else if (roles === "admin") {
        relationship_wrapper.style.display = "none";
        school_register_form.style.display = "block";
        
    } else {
        relationship_wrapper.style.display = "none";
        school_register_form.style.display = "none";
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let data;
    let schoolData;
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

    if (roles === "guardian") {
        const relationship = e.target.relationship.value;
        data = {
            userName,
            password,
            confirmedPassword,
            email,
            phone,
            roles,
            relationship
        };
    } else if (roles === "admin") {
        const schoolName = e.target.schoolName.value;
        const schoolAddress = e.target.schoolAddress.value;
        const schoolPhone = e.target.schoolPhone.value;
        const schoolEmail = e.target.schoolEmail.value;

        schoolData = {
            schoolName,
            address: schoolAddress,
            phone: schoolPhone,
            email: schoolEmail
        }

        data = {
            userName,
            password,
            confirmedPassword,
            email,
            phone,
            roles
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

    // form.reset();

    if (roles === "admin") {

        const registerRes = await fetch(registerApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        
        if (registerRes.status === 200) {
            const registerData = await registerRes.json();
            console.log(registerData);
            const token = registerData.result.token;
            console.log(token);
            const schoolRes = await fetch(
                createSchoolApi,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(schoolData)
                }
            )
            console.log(schoolRes)
            if (schoolRes.status === 200) {
                alert("Register successful");
                window.location.href = `${mainWebsite}/signIn.html`
                return;
            }
        } else {
            alert("Register failed! Check console for more information");
            return
        }
    }

    const res = await fetch(
        registerApi,
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
        window.location.href = `${mainWebsite}/signIn.html`;
    } else if (res.status === 401) {
        alert(resData.msg);
        console.log(resData);
    }
});

function isPasswordSame(password, c_password) {
    return password === c_password;
}

const go_to_signIn = document.getElementById("go_to_signIn");
go_to_signIn.addEventListener("click", ()=> {
    window.location.href = `${mainWebsite}/signIn.html`
})