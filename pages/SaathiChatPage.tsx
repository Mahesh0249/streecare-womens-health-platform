
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import type { ChatMessage } from '../types';
import { createSaathiChat } from '../services/geminiService';
import { SendIcon, BotIcon } from '../components/icons';
import type { Chat } from '@google/genai';

const SaathiChatPage: React.FC = () => {
    const { t, language } = useTranslation();
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const initializeChat = useCallback(() => {
        try {
            const session = createSaathiChat(language);
            setChatSession(session);
            setMessages([]);
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            setMessages([{ role: 'model', text: 'Sorry, I am unable to connect right now.' }]);
        }
    }, [language]);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !chatSession) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatSession.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble responding right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold text-gray-800">{t('saathi.title')}</h1>
                <p className="text-sm text-gray-500">{t('saathi.description')}</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0"><BotIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}{isLoading && msg.role === 'model' && index === messages.length -1 ? '...' : ''}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t">
                <div className="flex items-center bg-gray-100 rounded-lg">
                    <label htmlFor="chat-input" className="sr-only">{t('saathi.placeholder')}</label>
                    <input
                        id="chat-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('saathi.placeholder')}
                        className="flex-1 bg-transparent p-3 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 text-rose-500 disabled:text-gray-400" aria-label="Send message">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaathiChatPage;