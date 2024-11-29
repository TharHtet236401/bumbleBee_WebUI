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

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    
    // Set the message
    messageElement.textContent = message;
    
    // Set color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        // Redirect after notification starts to fade
        if (type === 'success') {
            setTimeout(() => {
                window.location.href = `${mainWebsite}/signIn.html`;
            }, 300);
        }
    }, 2000);
}

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
        showNotification("Password and Confirm Password must be same", 'error');
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
            const token = registerData.result.token;
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
            if (schoolRes.status === 200) {
                showNotification("Register successful");
                return;
            }
        } else {
            showNotification("Register failed! Check console for more information", 'error');
            return;
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
        showNotification("Register successful");
    } else if (res.status === 401) {
        showNotification(resData.msg, 'error');
    }
});

function isPasswordSame(password, c_password) {
    return password === c_password;
}

const go_to_signIn = document.getElementById("go_to_signIn");
go_to_signIn.addEventListener("click", ()=> {
    window.location.href = `${mainWebsite}/signIn.html`
})