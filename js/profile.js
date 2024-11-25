import {mainWebsite, getUserProfileApi, cookieCheckApi} from "./endpoints.js"
import { checkCookie } from "../utils/cookies.js";

const goToIndexButton = document.getElementById("goToIndex");
const profileDataEl = document.getElementById("profileData");
const profilePicture = document.getElementById("profilePicture");

// Default profile picture URL
const DEFAULT_PROFILE_PIC = "../assets/images/placeholder_bg.png";

let token;

goToIndexButton.addEventListener("click", ()=> {
    window.location.href = `${mainWebsite}/index.html`;
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const { statusCode, resData } = await checkCookie(cookieCheckApi);
        
        if (statusCode !== 200) {
            window.location.href = `${mainWebsite}/signIn.html`;
            return;
        }

        token = resData.token;
        const profileData = await getUserProfile();
        renderProfile(profileData.result);
        
    } catch (error) {
        console.error("Error loading profile:", error);
    }
});

async function renderProfile(userData) {
    // Handle profile picture
    profilePicture.innerHTML = `
        <div class="profile-picture-container">
            <img src="${userData.profilePicture}" 
                 alt="${userData.userName}'s profile picture"
                 onerror="this.src='${DEFAULT_PROFILE_PIC}'"
                 class="profile-image">
            <div class="profile-picture-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" fill="#A9F1FF"/>
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#A9F1FF"/>
                    <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="#A9F1FF"/>
                </svg>
            </div>
        </div>
    `;

    // Process user data
    const formattedClasses = formatClasses(userData.classes);
    const school = userData.schools?.[0]?.schoolName || "None";
    
    const userDataAll = {
        Name: userData.userName || "Not specified",
        Email: userData.email || "Not specified",
        Role: userData.roles?.[0] || "Not specified",
        Phone: userData.phone || "Not specified",
        School: school,
        Children: formatChildren(userData.childern),
        Relationship: formatRelationship(userData.relationship),
        Classes: formattedClasses
    };

    // Render profile fields
    profileDataEl.innerHTML = Object.entries(userDataAll)
        .map(([key, value], index) => `
            <div class="profileField" style="animation-delay: ${index * 0.1}s">
                <div class="profileKey">${key}</div>
                <div class="profileValue ${value === 'None' || value === 'Not specified' ? 'empty-value' : ''}">${value}</div>
            </div>
        `).join('');
}

function formatClasses(classes) {
    if (!classes || classes.length === 0) return "None";
    return classes.map(cls => 
        `Grade - ${cls.grade}(Class - ${cls.className})`
    ).join("<br>");
}

function formatChildren(children) {
    if (!children || children.length === 0) return "None";
    return Array.isArray(children) ? children.join(", ") : children;
}

function formatRelationship(relationship) {
    if (!relationship || relationship.length === 0) return "None";
    return Array.isArray(relationship) ? relationship.join(", ") : relationship;
}

async function getUserProfile() {
    try {
        const res = await fetch(getUserProfileApi, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            }
        });

        if (!res.ok) throw new Error('Failed to fetch profile data');
        
        return await res.json();
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}

