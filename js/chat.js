import { checkCookie } from "../utils/cookies.js";
import {mainApi, mainWebsite, getUserProfileApi, cookieCheckApi,  } from "./endpoints.js"

let token;
var currentUser;
let socket;

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode, resData } = await checkCookie(cookieCheckApi);
    currentUser = resData.userData._id;
    if (statusCode !== 200) {
        alert("Please sign in first");
        window.location.href = `${mainWebsite}/signIn.html`;
    }
    
    // Extract the _id from userData
    currentUser = resData.userData._id;  // This will get "6735a0fb511fe9fd300c8624"
    token = resData.token;
    
    // Initialize socket connection
    initializeSocket(token);
    
    const conversations = await getConversatinList(token);
    if (conversations.length > 0) {
        openChat(conversations[0].participants[0]);
    }
})

// Add new function to initialize socket
function initializeSocket(token) {
    // Initialize socket with auth headers
    socket = io('https://tharhtetaung.xyz/chat', {
        extraHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    // Listen for connection
    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    // Listen for welcome event
    socket.on('welcome', (data) => {
        console.log('Received welcome event:', data);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    // Listen for new messages
    socket.on('newMessage', (data) => {
        console.log('Received new message:', data);
        
        // Get the message object from the data
        const { message } = data;
        
        // Create and append the new message element
        const messagesContainer = document.querySelector('.chat_messages_container');
        const messageElement = document.createElement('div');
        
        // Check if the sender is the current user
        messageElement.className = `chat_message ${message.senderId._id === currentUser ? '' : 'me'}`;

        messageElement.innerHTML = `
            <div class="chat_message_profile">
                <img src="${message.senderId.profilePicture}" alt="${message.senderId.userName}" />
            </div>
            <div class="chat_message_content">
                <p>${message.message}</p>
                <span class="chat_message_time">${new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        
        // Scroll to the bottom of the messages container
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

async function getConversatinList(token) {
    const loadingSpinner = document.querySelector('.chat_history_list_wrapper .loading-spinner');
    const errorMessage = document.querySelector('.chat_history_error_message');
    
    try {
        // Show loading spinner, hide error message
        loadingSpinner.classList.add('active');
        errorMessage.style.display = 'none';

        const api = `${mainApi}/api/conversation/all`;
        const res = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        
        if (data.con) {
            updateChatCount(data.result.length);
            
            displayConversations(data.result);
            return data.result;
        } else {
            console.error('Failed to fetch conversations');
            errorMessage.style.display = 'block';
            updateChatCount(0);
            return [];
        }
    } catch (error) {
        console.error('Error fetching conversations:', error);
        errorMessage.style.display = 'block';
        updateChatCount(0);
        return [];
    } finally {
        // Hide loading spinner when done
        loadingSpinner.classList.remove('active');
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
        
        const conversationElement = document.createElement('div');
        conversationElement.className = 'chat_history_list';
        conversationElement.innerHTML = `
            <div class="chat_history_list_img">
                <img src="${participant.profilePicture}" alt="${participant.userName}" />
            </div>
            <div class="chat_history_list_info">
                <h3 class="search_result_name">${participant.userName}</h3>
                <span class="user_role">${participant.roles.join(', ')}</span>
            </div>
        `;

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

    // Fetch and display chat messages
    fetchChatMessages(participant._id);
}

// New function to fetch chat messages
async function fetchChatMessages(participantId) {
    const api = `${mainApi}/api/message/get/${participantId}`;
    const messagesContainer = document.querySelector('.chat_messages_container');
    const loadingSpinner = messagesContainer.querySelector('.loading-spinner');

    try {
        // Show loading spinner
        loadingSpinner.classList.add('active');

        // Clear previous messages but keep the loading spinner
        const messages = messagesContainer.querySelectorAll('.chat_message');
        messages.forEach(msg => msg.remove());

        const res = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (data.con) {
            displayMessages(data.result, participantId);
        } else {
            console.error('Failed to fetch messages');
            messagesContainer.innerHTML = '<p class="chat_error">Error fetching messages.</p>';
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        messagesContainer.innerHTML = '<p class="chat_error">Error fetching messages.</p>';
    } finally {
        // Hide loading spinner
        loadingSpinner.classList.remove('active');
    }
}

// New function to display messages
function displayMessages(messages, participantId) {
    const messagesContainer = document.querySelector('.chat_messages_container');
    const loadingSpinner = messagesContainer.querySelector('.loading-spinner');
    
    // Clear messages but preserve the loading spinner
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(loadingSpinner);

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        // Check if the sender is the current user
        messageElement.className = `chat_message ${message.senderId._id === currentUser ? '' : 'me'}`;

        messageElement.innerHTML = `
            <div class="chat_message_profile">
                <img src="${message.senderId.profilePicture}" alt="${message.senderId.userName}" />
            </div>
            <div class="chat_message_content">
                <p>${message.message}</p>
                <span class="chat_message_time">${new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
    });

    // Scroll to bottom of messages
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add this function to update the chat count
function updateChatCount(count) {
    const chatCountElement = document.querySelector('.chat_count');
    if (chatCountElement) {
        chatCountElement.textContent = count;
    }
}
