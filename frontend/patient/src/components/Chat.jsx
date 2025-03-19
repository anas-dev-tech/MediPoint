import { useState, useEffect, useRef } from "react";
import { getChatBotSessionId, sendChatBotMessage, endChatBotSession } from "../api/chatAPI";
import useAuth from "../hooks/useAuth";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
    const { isAuthenticated, user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "support",
            text: "Hello! How can we help you today?",
            icon: assets.chatbot_icon,
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isDetect, setIsDetect] = useState(false);
    const [specialty, setSpecialty] = useState("");
    const [isSpecialtyExists, setIsSpecialtyExists] = useState(false);
    const chatContainerRef = useRef(null);
    const tooltipRef = useRef(null); // Ref for tooltip to handle outside clicks
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            initializeChatSession();
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const initializeChatSession = async () => {
        try {
            if (sessionId) {
                await endChatSession();
            }
            const data = await getChatBotSessionId();
            setSessionId(data.chatbot_session_id);
        } catch (error) {
            console.error("Error initializing chat session:", error);
        }
    };

    const toggleChat = () => {
        if (!isAuthenticated) {
            setShowTooltip(!showTooltip); // Toggle tooltip for non-authenticated users
            return; // Do not open chat if not authenticated
        }
        setIsOpen(!isOpen);
    };

    const endChatSession = async () => {
        try {
            await endChatBotSession(sessionId);
            setSessionId(null);
        } catch (error) {
            console.error("Error ending chat session:", error);
        }
    };

    const handleSendMessage = async () => {
        setIsDetect(false);
        setIsSpecialtyExists(false);
        if (inputMessage.trim() === "" || !sessionId) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "user",
            text: inputMessage,
            icon: user?.user?.image || assets.profile_placeholder,
        };
        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
        setIsTyping(true);

        try {
            const { response } = await sendChatBotMessage(sessionId, inputMessage);
            const botReply = {
                id: messages.length + 2,
                sender: "support",
                text: response.text,
                icon: assets.chatbot_icon,
            };
            setMessages((prev) => [...prev, botReply]);

            // Check if AI detected a specialty
            if (response.is_detected) {
                setIsDetect(true);
                setSpecialty(response.specialty || "a specialist");
                if (response.is_existed) {
                    setIsSpecialtyExists(true);
                } else {
                    setIsSpecialtyExists(false);
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleNavigate = () => {
        setIsOpen(false);
        navigate(`/doctors/${specialty}/`);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* The floating chat icon with tooltip */}
            <div className="relative" ref={tooltipRef}>
                <button
                    onClick={toggleChat}
                    className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all transform hover:scale-110 animate-bounce"
                >
                    <img className="w-8 h-8" src={assets.chatbot_floating_icon} alt="Chatbot" />
                </button>

                {/* Tooltip for non-authenticated users */}
                {!isAuthenticated && showTooltip && (
                    <div className="absolute bottom-20 right-0 w-48 bg-gray-800 text-white text-sm p-2 rounded-lg opacity-100 transition-opacity duration-300">
                        Only logged in users can use the chat. You want to{" "}
                        <button className="ps-1 text-blue-400 underline" onClick={() => navigate("/login")}>
                            login
                        </button>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw]  bg-white rounded-lg shadow-lg border border-gray-200">
                    {/* The header */}
                    <div className="bg-primary text-white p-3 rounded-t-lg flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Chatbot</h2>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div ref={chatContainerRef} className="p-3 h-64 overflow-y-auto">
                        {messages.map((message) => (
                            <div key={message.id} className={`mb-3 flex ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                                <img src={message.sender === 'support' ? assets.chatbot_icon : message.icon} alt="Profile" className="w-8 h-8 rounded-full ms-1" />
                                <div className={`${message.sender === "support" ? "bg-gray-100 p-2 rounded-lg max-w-[70%]" : "bg-primary text-white p-2 rounded-lg max-w-[70%]"}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex">
                                <img src={assets.chatbot_icon} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                                <div className="bg-gray-100 p-2 rounded-lg max-w-[70%]">
                                    <div className="flex space-x-1">
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isDetect && (
                            <div className="mt-4 p-3 bg-green-100 rounded-lg text-blue-900 text-sm">
                                {
                                    isSpecialtyExists
                                        ? <>
                                            <p>You may need a <strong>{specialty}</strong>.</p>
                                            <button onClick={handleNavigate} className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                                                Find a {specialty}
                                            </button>
                                        </>
                                        : <p>Unfortunately, there is no doctor with such specialty <span className="py-[3px] px-[3px] rounded bg-green-200">{specialty}</span> in our website, but we are sure that soon there will be</p>
                                }
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-200 flex items-center gap-2">
                        <textarea
                            placeholder="Type a message..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm resize-none overflow-hidden"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                            rows={1} // Start with one row
                            style={{ height: 'auto' }} // Ensure dynamic height adjustment
                        />
                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105" onClick={handleSendMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingChat;