"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, MoreVertical, Users } from 'lucide-react';
import BottomNavigation from "@/components/navbar";

interface Message {
    id: string;
    user: string;
    avatar: string;
    message: string;
    timestamp: Date;
    isOwn?: boolean;
}

interface User {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
}

const CommunityChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers] = useState<User[]>([
        { name: 'Sarah', avatar: '🌸', status: 'online' },
        { name: 'Jake', avatar: '🏃‍♂️', status: 'online' },
        { name: 'Maria', avatar: '🥗', status: 'online' },
        { name: 'Alex', avatar: '💪', status: 'online' },
        { name: 'Emma', avatar: '🧘‍♀️', status: 'offline' },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageIndexRef = useRef(0);

    // Mock messages data
    const mockMessages: Omit<Message, 'id' | 'timestamp'>[] = [
        { user: 'Sarah', avatar: '🌸', message: 'Hey everyone! Just had my annual checkup today. Anyone else struggle with their doctor visits? 😅' },
        { user: 'Jake', avatar: '🏃‍♂️', message: 'Oh totally! I always forget what I wanted to ask when I get there lol' },
        { user: 'Maria', avatar: '🥗', message: 'Pro tip: write down your questions beforehand! Game changer for me' },
        { user: 'Sarah', avatar: '🌸', message: 'That\'s smart Maria! My doctor said my cholesterol is a bit high 😰' },
        { user: 'Alex', avatar: '💪', message: 'Don\'t worry Sarah! Mine was high too, but diet changes really helped' },
        { user: 'Jake', avatar: '🏃‍♂️', message: 'What kind of changes did you make Alex? I could probably use some tips too' },
        { user: 'Alex', avatar: '💪', message: 'Cut back on fried foods, added more fish and oats. Lost 15lbs too!' },
        { user: 'Maria', avatar: '🥗', message: 'Oats are amazing! I have overnight oats every morning now 🥣' },
        { user: 'Sarah', avatar: '🌸', message: 'You guys are motivating me! I really need to get back to meal prepping' },
        { user: 'Jake', avatar: '🏃‍♂️', message: 'Same here! Been eating way too much takeout lately 🍕' },
        { user: 'Alex', avatar: '💪', message: 'Sunday meal prep sessions are my secret weapon. Takes 2 hours, saves the whole week' },
        { user: 'Maria', avatar: '🥗', message: 'Yes! And drinking more water too. I got one of those big water bottles' },
        { user: 'Sarah', avatar: '🌸', message: 'Water is so hard for me! I forget constantly 💧' },
        { user: 'Jake', avatar: '🏃‍♂️', message: 'There are apps that remind you! I use one that sends notifications' },
        { user: 'Alex', avatar: '💪', message: 'Speaking of apps, anyone tracking their steps? I\'m obsessed with hitting 10k' },
        { user: 'Maria', avatar: '🥗', message: 'I love my fitness tracker! Makes walking so much more fun' },
        { user: 'Sarah', avatar: '🌸', message: 'I should start walking more. Been sitting at my desk all day lately 😴' },
        { user: 'Jake', avatar: '🏃‍♂️', message: 'Even 10-15 minute walks help! I take calls while walking now' },
        { user: 'Alex', avatar: '💪', message: 'And don\'t forget about sleep! I feel so much better since I started going to bed earlier' },
        { user: 'Maria', avatar: '🥗', message: 'Sleep is everything! My skin and mood are so much better with 8 hours ✨' },
    ];

    // Auto add messages with realistic timing
    useEffect(() => {
        const addMessage = () => {
            if (messageIndexRef.current < mockMessages.length) {
                const mockMsg = mockMessages[messageIndexRef.current];
                const newMsg: Message = {
                    id: Date.now().toString(),
                    ...mockMsg,
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, newMsg]);
                messageIndexRef.current++;
            }
        };

        // Add first message immediately
        addMessage();

        // Then add messages with random intervals (2-8 seconds)
        const interval = setInterval(() => {
            if (messageIndexRef.current < mockMessages.length) {
                addMessage();
            } else {
                clearInterval(interval);
            }
        }, Math.random() * 6000 + 2000);

        return () => clearInterval(interval);
    }, []);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const userMessage: Message = {
                id: Date.now().toString(),
                user: 'You',
                avatar: '😊',
                message: newMessage,
                timestamp: new Date(),
                isOwn: true,
            };

            setMessages(prev => [...prev, userMessage]);
            setNewMessage('');
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-purple-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <Users size={20}/>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">MedX Community</h1>
                            <p className="text-purple-200 text-sm">{onlineUsers.filter(u => u.status === 'online').length} members
                                online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Online Users */}
            <div className="bg-white px-4 py-3 border-b border-purple-100">
                <div className="flex space-x-2 overflow-x-auto">
                    {onlineUsers.map((user, index) => (
                        <div key={index} className="flex-shrink-0 text-center">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                                    {user.avatar}
                                </div>
                                {user.status === 'online' && (
                                    <div
                                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 max-w-12 truncate">{user.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex ${message.isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs`}>
                            <div
                                className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                                {message.avatar}
                            </div>
                            <div>
                                <div
                                    className={`px-4 py-2 rounded-2xl ${
                                        message.isOwn
                                            ? 'bg-purple-600 text-white rounded-br-sm'
                                            : 'bg-white text-gray-800 border border-purple-100 rounded-bl-sm'
                                    } shadow-sm`}
                                >
                                    {!message.isOwn && (
                                        <p className="text-xs font-medium text-purple-600 mb-1">{message.user}</p>
                                    )}
                                    <p className="text-sm leading-relaxed">{message.message}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right' : 'text-left'}`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-purple-100 p-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Smile size={20} className="text-purple-400"/>
                        </button>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                    >
                        <Send size={20}/>
                    </button>
                </div>
                <div className="mt-21">
                    <BottomNavigation/>
                </div>
            </div>

        </div>

    );
};

export default CommunityChat;