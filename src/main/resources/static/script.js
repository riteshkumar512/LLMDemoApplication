const API_URL = "http://localhost:8080/api/chat";

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const typing = document.getElementById("typing");


function sendSuggestion(message) {
    messageInput.value = message;
    sendMessage();
}


async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    // Display user's message
    addUserMessage(message);

    // Clear input
    messageInput.value = "";

    // Disable send button while waiting
    sendButton.disabled = true;

    // Show typing indicator
    typing.style.display = "block";

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "text/plain"
            },

            body: message
        });

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        // Controller returns String
        const botResponse = await response.text();

        console.log("Tomato response:", botResponse);

        addBotMessage(botResponse);

    } catch (error) {

        console.error("Error:", error);

        addBotMessage(
            "Sorry 😔 I couldn't connect to Tomato. Please check that your Spring Boot application is running."
        );

    } finally {

        typing.style.display = "none";
        sendButton.disabled = false;
        messageInput.focus();
    }
}


function addUserMessage(message) {

    const messageElement = document.createElement("div");

    messageElement.className = "message user-message";

    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-name">You</div>
            <div class="bubble">${escapeHtml(message)}</div>
        </div>
    `;

    chatMessages.appendChild(messageElement);

    scrollToBottom();
}


function addBotMessage(message) {

    const messageElement = document.createElement("div");

    messageElement.className = "message bot-message";

    messageElement.innerHTML = `
        <div class="avatar">🍅</div>

        <div class="message-content">
            <div class="message-name">Tomato</div>
            <div class="bubble">${escapeHtml(message)}</div>
        </div>
    `;

    chatMessages.appendChild(messageElement);

    scrollToBottom();
}


function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Press Enter to send
messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});