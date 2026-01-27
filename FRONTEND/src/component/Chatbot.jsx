import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Draggable from 'react-draggable';
import { BsChatDotsFill, BsX, BsSendFill } from 'react-icons/bs';
import { SiGoogleassistant } from 'react-icons/si';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';

const Chatbot = () => {
    const { userData } = useSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm your Virtual Courses AI assistant. How can I guide you today?" }] }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Update greeting if user logs in/out
        setMessages([{ role: 'model', parts: [{ text: userData ? `Hello ${userData.name}! I'm your Virtual Courses AI assistant. How can I guide you today?` : "Hello! I'm your Virtual Courses AI assistant. Please login to get personalized guidance, or ask me anything about our platform!" }] }]);
    }, [userData]); 

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!userData && messages.length > 2) {
             setMessages(prev => [...prev, 
                { role: 'user', parts: [{ text: input }] },
                { role: 'model', parts: [{ text: "I'd love to help you further! Please login or sign up to continue this conversation." }] }
             ]);
             setInput('');
             return;
        }

        const userMsg = { role: 'user', parts: [{ text: input }] };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${serverUrl}/api/chatbot/chat`, 
                { messages: updatedMessages }, 
                { withCredentials: true }
            );

            setMessages([...updatedMessages, { role: 'model', parts: [{ text: response.data.text }] }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages([...updatedMessages, { role: 'model', parts: [{ text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    // if (!userData) return null; // REMOVED: Now visible to everyone

    // Hide chatbot on chat page to prevent blocking UI
    const location = useLocation();
    const draggableRef = useRef(null);
    
    if (location.pathname === "/chat") return null;

    return (
        <Draggable nodeRef={draggableRef}>
            <div ref={draggableRef} className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end cursor-move">
                {/* Chat Window */}
                {isOpen && (
                    <div className="w-[calc(100vw-3rem)] md:w-[400px] h-[60vh] md:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-300 cursor-default" onMouseDown={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-black p-4 flex items-center justify-between text-white cursor-move" onMouseDown={(e) => e.target.closest('.draggable-container')?.dispatchEvent(new MouseEvent('mousedown', e))}> 
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <SiGoogleassistant className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Virtual Assistant</h3>
                                    <p className="text-[10px] text-gray-400">Powered by Gemini AI</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <BsX className="text-2xl" />
                            </button>
                        </div>

                        {/* Messages Section */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-black text-white rounded-tr-none' 
                                        : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
                                    }`}>
                                        {msg.parts[0].text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <SyncLoader size={5} color="#000" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Section */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-black text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:bg-gray-300 disabled:scale-100"
                            >
                                <BsSendFill className="text-sm" />
                            </button>
                        </form>
                    </div>
                )}

                {/* Toggle Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${
                        isOpen ? 'bg-red-500 rotate-90' : 'bg-black'
                    }`}
                >
                    {isOpen ? <BsX className="text-white text-3xl" /> : <BsChatDotsFill className="text-white text-2xl" />}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                        </span>
                    )}
                </button>
            </div>
        </Draggable>
    );
};

export default Chatbot;
