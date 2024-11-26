import { checkCookie } from "../utils/cookies.js";
import {mainApi, mainWebsite, getUserProfileApi, cookieCheckApi,  } from "./endpoints.js"

let token;
var currentUser;
let socket;
let currentRecipientId;
let selectedImages = [];

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

    const messageForm = document.querySelector('.message_form');
    const messageInput = messageForm.querySelector('.message_input');

    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if ((!message && selectedImages.length === 0) || !currentRecipientId) return;

        // Send the message
        await sendMessage(message);
        
        // Clear input
        messageInput.value = '';
    });

    // Add image input handler
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.querySelector('.image_preview_container');
    
    imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                selectedImages.push(file);
                displayImagePreview(file);
            }
        });
        if (selectedImages.length > 0) {
            document.querySelector('.message_input_wrapper').classList.add('has_images');
        }
    });
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
        
        const { message } = data;
        
        // Only display if it's not our own message
        if (message.senderId._id !== currentUser) {
            const messagesContainer = document.querySelector('.chat_messages_container');
            const messageElement = document.createElement('div');
            
            // Add 'me' class for right alignment for received messages
            messageElement.className = 'chat_message me';

            // Create HTML for images if present
            const imagesHTML = message.image && message.image.length > 0 ? 
                message.image.map(img => `<img src="${img}" alt="Sent image" style="max-width: 200px; border-radius: 8px; margin: 4px 0;">`).join('') 
                : '';

            messageElement.innerHTML = `
                <div class="chat_message_profile">
                    <img src="${message.senderId.profilePicture}" alt="${message.senderId.userName}" />
                </div>
                <div class="chat_message_content">
                    ${message.message ? `<p>${message.message}</p>` : ''}
                    ${imagesHTML}
                    <span class="chat_message_time">${new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `;

            messagesContainer.appendChild(messageElement);
            scrollToLatestMessage();
        }
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
    currentRecipientId = participant._id;
    
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

    // Display messages in chronological order
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        // Check if the sender is the current user
        messageElement.className = `chat_message ${message.senderId._id === currentUser ? '' : 'me'}`;

        // Create HTML for images if present
        const imagesHTML = message.image && message.image.length > 0 ? 
            message.image.map(img => `<img src="${img}" alt="Sent image" style="max-width: 200px; border-radius: 8px; margin: 4px 0;">`).join('') 
            : '';

        messageElement.innerHTML = `
            <div class="chat_message_profile">
                <img src="${message.senderId.profilePicture}" alt="${message.senderId.userName}" />
            </div>
            <div class="chat_message_content">
                ${message.message ? `<p>${message.message}</p>` : ''}
                ${imagesHTML}
                <span class="chat_message_time">${new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
    });

    scrollToLatestMessage();
}

// Add this function to update the chat count
function updateChatCount(count) {
    const chatCountElement = document.querySelector('.chat_count');
    if (chatCountElement) {
        chatCountElement.textContent = count;
    }
}

// Add this new function
function scrollToLatestMessage() {
    const messagesContainer = document.querySelector('.chat_messages_container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add new function to handle message sending
async function sendMessage(message) {
    const submitButton = document.querySelector('.submit_button');
    submitButton.disabled = true;
    
    // Create temporary message element with sending state
    const tempMessageElement = document.createElement('div');
    tempMessageElement.className = 'chat_message sending';
    if (!message && selectedImages.length > 0) {
        tempMessageElement.classList.add('image-only');
    }

    // Create temporary preview for images
    const imagePreviewsHTML = selectedImages.length > 0 ? 
        Array.from(selectedImages).map(file => {
            const url = URL.createObjectURL(file);
            return `<img src="${url}" alt="Sending image" style="opacity: 0.7;">`;
        }).join('') : '';

    tempMessageElement.innerHTML = `
        <div class="chat_message_profile">
            <img src="${document.querySelector('.chat_message_profile img')?.src || ''}" alt="You" />
        </div>
        <div class="chat_message_content">
            ${message ? `<p>${message}</p>` : ''}
            ${imagePreviewsHTML}
            <span class="chat_message_time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;

    const messagesContainer = document.querySelector('.chat_messages_container');
    messagesContainer.appendChild(tempMessageElement);
    scrollToLatestMessage();
    
    try {
        const formData = new FormData();
        if (message) {
            formData.append('message', message);
        }
        
        selectedImages.forEach(image => {
            formData.append('images', image);
        });

        const api = `${mainApi}/api/message/send/${currentRecipientId}`;
        const res = await fetch(api, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await res.json();
        if (data.con) {
            // Replace temporary message with actual message
            const messageElement = document.createElement('div');
            messageElement.className = 'chat_message';

            const imagesHTML = data.result.image && data.result.image.length > 0 ? 
                data.result.image.map(img => `<img src="${img}" alt="Sent image" style="max-width: 200px; border-radius: 8px; margin: 4px 0;">`).join('') 
                : '';

            messageElement.innerHTML = `
                <div class="chat_message_profile">
                    <img src="${data.result.senderId.profilePicture}" alt="${data.result.senderId.userName}" />
                </div>
                <div class="chat_message_content">
                    ${message ? `<p>${message}</p>` : ''}
                    ${imagesHTML}
                    <span class="chat_message_time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `;

            // Replace the temporary message with the actual one
            tempMessageElement.replaceWith(messageElement);

            // Clear the selected images and preview
            selectedImages = [];
            document.querySelector('.image_preview_container').innerHTML = '';
            document.querySelector('.message_input_wrapper').classList.remove('has_images');
        } else {
            // Show error state
            tempMessageElement.classList.remove('sending');
            tempMessageElement.classList.add('error');
            console.error('Failed to send message:', data);
        }
    } catch (error) {
        // Show error state
        tempMessageElement.classList.remove('sending');
        tempMessageElement.classList.add('error');
        console.error('Error sending message:', error);
    } finally {
        submitButton.disabled = false;
        
        // Clean up any object URLs we created
        if (selectedImages.length > 0) {
            tempMessageElement.querySelectorAll('img').forEach(img => {
                URL.revokeObjectURL(img.src);
            });
        }
    }
}

function displayImagePreview(file) {
    const previewContainer = document.querySelector('.image_preview_container');
    const reader = new FileReader();

    reader.onload = (e) => {
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'image_preview';
        
        previewWrapper.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button class="remove_image" onclick="removeImage(this, '${file.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        previewContainer.appendChild(previewWrapper);
    };

    reader.readAsDataURL(file);
}

function removeImage(button, fileName) {
    const previewElement = button.parentElement;
    selectedImages = selectedImages.filter(file => file.name !== fileName);
    previewElement.remove();
    
    if (selectedImages.length === 0) {
        document.querySelector('.message_input_wrapper').classList.remove('has_images');
    }
}
