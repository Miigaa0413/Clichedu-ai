document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // LANDING PAGE
    // ========================================

    const primaryButtons =
        document.querySelectorAll(".primary-btn");

    const secondaryButtons =
        document.querySelectorAll(".secondary-btn");


    primaryButtons.forEach(button => {

        button.addEventListener("click", () => {

            window.location.href =
                "pages/ai-tutor.html";

        });

    });


    secondaryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const subjects =
                document.querySelector("#subjects");

            if (subjects) {

                subjects.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });


    // ========================================
    // NAVIGATION
    // ========================================

    const navLinks =
        document.querySelectorAll(".navbar nav a");


    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");


            if (href && href.startsWith("#")) {

                event.preventDefault();

                const target =
                    document.querySelector(href);


                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }

        });

    });


    // ========================================
    // LOGIN
    // ========================================

    const loginButton =
        document.querySelector(".login-btn");


    if (loginButton) {

        loginButton.addEventListener("click", () => {

            alert(
                "Нэвтрэх системийг дараагийн шатанд холбоно."
            );

        });

    }


    // ========================================
    // AI TUTOR
    // ========================================

    const messageInput =
        document.querySelector("#messageInput");

    const sendButton =
        document.querySelector("#sendMessage");

    const chatArea =
        document.querySelector("#chatArea");


    // AI Tutor page биш бол энд зогсоно

    if (!messageInput || !sendButton || !chatArea) {
        return;
    }


    // ========================================
    // CONVERSATION ID
    // ========================================

    let conversationId =
        localStorage.getItem("clichedu_conversation_id");


    // ========================================
    // SEND MESSAGE
    // ========================================

    async function sendMessage() {

        const text =
            messageInput.value.trim();


        if (!text) {
            return;
        }


        // Welcome screen устгах

        const welcome =
            chatArea.querySelector(".welcome");


        if (welcome) {
            welcome.remove();
        }


        // User message

        addMessage(
            text,
            "user"
        );


        // Input цэвэрлэх

        messageInput.value = "";


        // AI thinking

        const thinking =
            document.createElement("div");


        thinking.className =
            "chat-message ai";


        thinking.innerHTML = `
            <div class="chat-bubble">
                Clichedu AI бодож байна...
            </div>
        `;


        chatArea.appendChild(thinking);

        scrollToBottom();


        // Button disable

        sendButton.disabled = true;


        try {

            // ====================================
            // API REQUEST
            // ====================================

            const response =
                await fetch(
                    "/api/chat",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            message: text,

                            conversation_id:
                                conversationId
                                    ? Number(conversationId)
                                    : null

                        })

                    }
                );


            const data =
                await response.json();


            // Thinking remove

            thinking.remove();


            // ====================================
            // ERROR
            // ====================================

            if (!response.ok) {

                addMessage(
                    data.detail ||
                    "Уучлаарай, AI server дээр алдаа гарлаа.",
                    "ai"
                );

                return;
            }


            // ====================================
            // SAVE CONVERSATION ID
            // ====================================

            if (data.conversation_id) {

                conversationId =
                    data.conversation_id;

                localStorage.setItem(
                    "clichedu_conversation_id",
                    conversationId
                );

            }


            // ====================================
            // AI RESPONSE
            // ====================================

            addMessage(
                data.response,
                "ai"
            );


        } catch (error) {

            console.error(
                "Clichedu API Error:",
                error
            );


            thinking.remove();


            addMessage(
                "Clichedu AI server-тэй холбогдож чадсангүй. Backend ажиллаж байгаа эсэхийг шалгана уу.",
                "ai"
            );


        } finally {

            sendButton.disabled = false;

            messageInput.focus();

        }

    }


    // ========================================
    // ADD MESSAGE
    // ========================================

    function addMessage(
        text,
        type
    ) {

        const message =
            document.createElement("div");


        message.className =
            `chat-message ${type}`;


        const bubble =
            document.createElement("div");


        bubble.className =
            "chat-bubble";


        bubble.textContent =
            text;


        message.appendChild(
            bubble
        );


        chatArea.appendChild(
            message
        );


        scrollToBottom();

    }


    // ========================================
    // QUICK ACTIONS
    // ========================================

    const quickButtons =
        document.querySelectorAll(
            ".quick-actions button"
        );


    quickButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const subject =
                    button.textContent.trim();


                messageInput.value =
                    `${subject} дээр надад хичээл заагаач.`;


                messageInput.focus();

            }
        );

    });


    // ========================================
    // ENTER TO SEND
    // ========================================

    messageInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // ========================================
    // SEND BUTTON
    // ========================================

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    // ========================================
    // AUTO SCROLL
    // ========================================

    function scrollToBottom() {

        setTimeout(() => {

            chatArea.scrollTo({

                top:
                    chatArea.scrollHeight,

                behavior:
                    "smooth"

            });

        }, 50);

    }

});