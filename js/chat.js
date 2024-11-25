import { checkCookie } from "../utils/cookies.js";
import {mainApi, mainWebsite, getUserProfileApi, cookieCheckApi,  } from "./endpoints.js"

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
    try {
        const api = `${mainApi}/api/conversation/all`;
        const res = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        console.log(data);
        if (data.con) {
            displayConversations(data.result);
        } else {
            console.error('Failed to fetch conversations');
            document.querySelector('.chat_history_error_message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching conversations:', error);
        document.querySelector('.chat_history_error_message').style.display = 'block';
    }
}

function displayConversations(conversations) {
    const container = document.querySelector('.chat_history_list_wrapper');
    const errorMessage = document.querySelector('.chat_history_error_message');
    
    if (!conversations || conversations.length === 0) {
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';
    container.innerHTML = '';

    conversations.forEach(conversation => {
        const participant = conversation.participants[0];
        const date = new Date(conversation.updatedAt);
        
        const conversationElement = document.createElement('div');
        conversationElement.className = 'chat_history_list';
        conversationElement.innerHTML = `
            <div class="chat_history_list_img">
                <img src="${participant.profilePicture}" alt="${participant.userName}" />
            </div>
            <div class="chat_history_list_info">
                <h3 class="search_result_name">${participant.userName}</h3>
                <span class="user_role">${participant.roles.join(', ')}</span>
                <span class="conversation_time">${formatDate(date)}</span>
            </div>
        `;

        // Add click event to open chat with this user
        conversationElement.addEventListener('click', () => {
            openChat(participant);
        });

        container.appendChild(conversationElement);
    });
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    
    // If less than 24 hours, show time
    if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If less than 7 days, show day name
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Otherwise show date
    return date.toLocaleDateString();
}

function openChat(participant) {
    // Update the chat header with participant info
    const profileImg = document.querySelector('.chat_right_top_profile_img img');
    const profileName = document.querySelector('.chat_right_top_profile_name');
    
    profileImg.src = participant.profilePicture;
    profileImg.alt = participant.userName;
    profileName.textContent = participant.userName;

    // You can add logic here to fetch and display chat messages
    // fetchChatMessages(participant._id);
}
