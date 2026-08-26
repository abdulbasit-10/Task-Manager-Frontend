import React, { useContext, useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { getSocket } from '../../utils/socket'
import { LuSend } from 'react-icons/lu'

const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
};

const GroupChat = () => {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    // load message history
    const loadMessages = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.CHAT.GET_GROUP_MESSAGES);
            setMessages(response.data || []);
        } catch (error) {
            console.log('Error loading messages:', error);
        }
    };

    useEffect(() => {
        loadMessages();

        const socket = getSocket();
        socket.connect();

        socket.on('newGroupMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('newGroupMessage');
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const socket = getSocket();
        socket.emit('sendGroupMessage', text.trim());
        setText('');
    };

    return (
        <DashboardLayout activeMenu="Chat">
            <div className='mt-5 flex flex-col h-[calc(100vh-140px)] card p-0 overflow-hidden'>
                <div className='px-5 py-4 border-b border-gray-100'>
                    <h2 className='text-lg font-display font-semibold text-ink-900'>Team Chat</h2>
                    <p className='text-[12px] text-ink-600'>Everyone on the team can see these messages.</p>
                </div>

                <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4'>
                    {messages.map((msg) => {
                        const isMe = msg.sender?._id === user?._id;
                        return (
                            <div key={msg._id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {!isMe && (
                                    msg.sender?.profileImageUrl ? (
                                        <img
                                            src={msg.sender.profileImageUrl}
                                            alt={msg.sender.name}
                                            className='w-7 h-7 rounded-full object-cover shrink-0'
                                        />
                                    ) : (
                                        <div className='w-7 h-7 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0'>
                                            <span className='text-[10px] font-semibold text-brand-600'>
                                                {getInitials(msg.sender?.name)}
                                            </span>
                                        </div>
                                    )
                                )}

                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                        ? 'bg-brand-500 text-white rounded-br-sm'
                                        : 'bg-gray-100 text-ink-900 rounded-bl-sm'
                                    }`}>
                                    {!isMe && (
                                        <p className='text-[11px] font-semibold text-brand-600 mb-0.5'>
                                            {msg.sender?.name}
                                        </p>
                                    )}
                                    <p className='text-[13.5px] leading-snug'>{msg.text}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className='flex items-center gap-2 px-5 py-4 border-t border-gray-100'>
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Type a message…'
                        className='flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 outline-none focus:border-brand-300'
                    />
                    <button
                        type='submit'
                        className='w-10 h-10 shrink-0 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center cursor-pointer transition-colors'
                    >
                        <LuSend size={16} />
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default GroupChat
