import { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { getInitials, timeAgo } from '../utils/helpers';
import { FiSend, FiMessageCircle } from 'react-icons/fi';

export default function Messages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user?.userId) {
            messageService.getConversations(user.userId)
                .then(r => setConversations(r.data.data || []))
                .finally(() => setLoading(false));
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!activeConv) return;
        const poll = setInterval(async () => {
            try {
                const res = await messageService.getMessages(activeConv.id, user.userId);
                setMessages(res.data.data?.messages || []);
            } catch { }
        }, 5000);
        return () => clearInterval(poll);
    }, [activeConv]);

    const openConversation = async (conv) => {
        setActiveConv(conv);
        try {
            const res = await messageService.getMessages(conv.id, user.userId);
            setMessages(res.data.data?.messages || []);
        } catch { }
    };

    const handleSend = async () => {
        if (!newMsg.trim() || !activeConv) return;
        setSending(true);
        try {
            const res = await messageService.send(activeConv.id, user.userId, newMsg);
            setMessages(res.data.data?.messages || []);
            setNewMsg('');
        } catch { }
        finally { setSending(false); }
    };

    const getOther = (conv) => conv.participants?.find(p => p.userId !== user?.userId);

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div style={{ padding: 24, height: 'calc(100vh - 70px)' }}>
                <div className="chat-layout" style={{ height: '100%' }}>
                    <div className="chat-sidebar">
                        <div className="chat-sidebar-header"><FiMessageCircle style={{ marginRight: 8 }} />Messages</div>
                        {loading ? <div style={{ padding: 24, textAlign: 'center' }}><span className="spinner" /></div>
                            : conversations.length === 0
                                ? <div className="empty-state" style={{ padding: 30 }}>
                                    <div className="empty-state__icon">💬</div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--txt-muted)' }}>No conversations yet</p>
                                </div>
                                : conversations.map(conv => {
                                    const other = getOther(conv);
                                    return (
                                        <div key={conv.id} className={`chat-item ${activeConv?.id === conv.id ? 'active' : ''}`} onClick={() => openConversation(conv)}>
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <div className="avatar avatar-sm" style={{ background: 'var(--grad-primary)' }}>{getInitials(other?.name || 'U')}</div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div className="chat-item__name">{other?.name || 'User'}</div>
                                                    <div className="chat-item__preview">{conv.lastMessage?.message || '…'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                    </div>

                    <div className="chat-main">
                        {!activeConv
                            ? <div className="empty-state" style={{ margin: 'auto' }}>
                                <div className="empty-state__icon">💬</div>
                                <div className="empty-state__title">Select a conversation</div>
                            </div>
                            : <>
                                <div className="chat-header">
                                    <div className="avatar avatar-sm" style={{ background: 'var(--grad-primary)' }}>{getInitials(getOther(activeConv)?.name || 'U')}</div>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{getOther(activeConv)?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-muted)' }}>{getOther(activeConv)?.userType}</div>
                                    </div>
                                </div>
                                <div className="chat-messages">
                                    {messages.map((msg, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.senderId === user?.userId ? 'flex-end' : 'flex-start' }}>
                                            <div className={`msg-bubble ${msg.senderId === user?.userId ? 'sent' : 'received'}`}>{msg.message}</div>
                                            <div className="msg-time">{timeAgo(msg.timestamp)}</div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="chat-footer">
                                    <input className="form-control" placeholder="Type a message..." value={newMsg}
                                        onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                                    <button className="btn btn-primary btn-icon" onClick={handleSend} disabled={sending || !newMsg.trim()}>
                                        <FiSend size={16} />
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
