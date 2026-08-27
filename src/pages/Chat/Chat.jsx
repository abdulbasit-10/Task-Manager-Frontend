import React, { useContext, useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { getSocket } from '../../utils/socket'
import { LuSend, LuUsers } from 'react-icons/lu'

const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
};

const getDMRoomId = (id1, id2) => [id1?.toString(), id2?.toString()].sort().join('_');

const Chat = () => {
    const { user } = useContext(UserContext);
    const [contacts, setContacts] = useState([]);
    const [activeConversation, setActiveConversation] = useState({ type: 'group' });
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    const loadContacts = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.CHAT.GET_CONTACTS);
            setContacts(response.data || []);
        } catch (error) {
            console.log('Error loading contacts:', error);
        }
    };

    const loadConversation = async (conversation) => {
        try {
            if (conversation.type === 'group') {
                const response = await axiosInstance.get(API_PATHS.CHAT.GET_GROUP_MESSAGES);
                setMessages(response.data || []);
            } else {
                const response = await axiosInstance.get(API_PATHS.CHAT.GET_DM_MESSAGES(conversation.user._id));
                setMessages(response.data || []);

                const socket = getSocket();
                socket.emit('joinDM', conversation.user._id);
            }
        } catch (error) {
            console.log('Error loading conversation:', error);
        }
    };

    useEffect(() => {
        loadContacts();

        const socket = getSocket();
        socket.connect();

        socket.on('newGroupMessage', (message) => {
            setActiveConversation((current) => {
                if (current.type === 'group') {
                    setMessages((prev) => [...prev, message]);
                }
                return current;
            });
        });

        socket.on('newDirectMessage', (message) => {
            setActiveConversation((current) => {
                if (current.type === 'dm') {
                    const roomId = getDMRoomId(user._id, current.user._id);
                    if (message.room === roomId) {
                        setMessages((prev) => [...prev, message]);
                    }
                }
                return current;
            });
        });

        return () => {
            socket.off('newGroupMessage');
            socket.off('newDirectMessage');
        };
    }, []);

    useEffect(() => {
        loadConversation(activeConversation);
    }, [activeConversation]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const socket = getSocket();

        if (activeConversation.type === 'group') {
            socket.emit('sendGroupMessage', text.trim());
        } else {
            socket.emit('sendDirectMessage', { to: activeConversation.user._id, text: text.trim() });
        }

        setText('');
    };

    const isGroupActive = activeConversation.type === 'group';

    return (
        <DashboardLayout activeMenu="Chat">
            <div className='mt-5 flex h-[calc(100vh-140px)] card p-0 overflow-hidden'>
                {/* Conversation list */}
                <div className='w-64 shrink-0 border-r border-gray-100 overflow-y-auto'>
                    <button
                        type='button'
                        onClick={() => setActiveConversation({ type: 'group' })}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${isGroupActive ? 'bg-brand-50' : 'hover:bg-gray-50'
                            }`}
                    >
                        <div className='w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center shrink-0'>
                            <LuUsers size={16} className='text-white' />
                        </div>
                        <div className='min-w-0'>
                            <p className={`text-[13px] font-medium truncate ${isGroupActive ? 'text-brand-600' : 'text-ink-900'}`}>Team Chat</p>
                            <p className='text-[11px] text-ink-600 truncate'>Everyone</p>
                        </div>
                    </button>

                    <div className='px-4 py-2 text-[11px] font-medium text-ink-300 uppercase tracking-wide'>
                        Direct Messages
                    </div>

                    {contacts.map((contact) => {
                        const isActive = activeConversation.type === 'dm' && activeConversation.user._id === contact._id;
                        return (
                            <button
                                key={contact._id}
                                type='button'
                                onClick={() => setActiveConversation({ type: 'dm', user: contact })}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${isActive ? 'bg-brand-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                {contact.profileImageUrl ? (
                                    <img
                                        src={contact.profileImageUrl}
                                        alt={contact.name}
                                        className='w-9 h-9 rounded-full object-cover shrink-0'
                                    />
                                ) : (
                                    <div className='w-9 h-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0'>
                                        <span className='text-[11px] font-semibold text-brand-600'>
                                            {getInitials(contact.name)}
                                        </span>
                                    </div>
                                )}
                                <div className='min-w-0'>
                                    <p className={`text-[13px] font-medium truncate ${isActive ? 'text-brand-600' : 'text-ink-900'}`}>{contact.name}</p>
                                    <p className='text-[11px] text-ink-600 truncate'>{contact.role === 'admin' ? 'Admin' : 'Member'}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Message panel */}
                <div className='flex-1 flex flex-col min-w-0'>
                    <div className='px-5 py-4 border-b border-gray-100'>
                        <h2 className='text-[15px] font-display font-semibold text-ink-900'>
                            {isGroupActive ? 'Team Chat' : activeConversation.user?.name}
                        </h2>
                        <p className='text-[12px] text-ink-600'>
                            {isGroupActive ? 'Everyone on the team can see these messages.' : 'Private conversation'}
                        </p>
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
                                        {!isMe && isGroupActive && (
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
            </div>
        </DashboardLayout>
    )
}

export default Chat
