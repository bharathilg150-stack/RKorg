import React, { useState } from 'react';
import { 
  Mail, MailOpen, Trash2, Reply, Send, CheckCircle2, 
  Archive, User, Phone, Calendar, Search, HelpCircle 
} from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminMessagesProps {
  contactMessages: ContactMessage[];
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
}

export default function AdminMessages({
  contactMessages,
  updateMessageStatus,
  deleteMessage,
}: AdminMessagesProps) {
  const [statusTab, setStatusTab] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Handle Inline Reply Submit
  const handleReplySubmit = async (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/api/messages/${msgId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyingId(null);
        setReplyText('');
        alert('✓ Direct email reply broadcast and archived securely.');
      } else {
        alert('Failed to send reply: ' + data.message);
      }
    } catch (err) {
      console.error('Reply submit error', err);
    }
  };

  // Filter messages
  const filteredMessages = contactMessages.filter(msg => {
    if (statusTab === 'all') return true;
    return msg.status === statusTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Executive Helpdesk Inbox</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Review contact inquiries, client registrations, & candidate help tickets
          </p>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusTab(f)}
              className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded transition-all ${
                statusTab === f ? 'bg-[#0A2C66] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox view list */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="p-12 border border-dashed rounded-xl text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest flex flex-col items-center gap-3">
            <MailOpen className="h-8 w-8 text-slate-300" />
            No helpdesk messages received in this tab.
          </div>
        ) : (
          filteredMessages.map(msg => {
            const isReplying = replyingId === msg.id;
            return (
              <div key={msg.id} className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 text-xs shadow-sm font-semibold text-slate-600 text-left hover:shadow-md transition-shadow">
                
                {/* Meta details header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">{msg.subject}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> By {msg.name}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {msg.phone}</span>}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status dropdown */}
                    <select
                      value={msg.status}
                      onChange={async (e) => await updateMessageStatus(msg.id, e.target.value as any)}
                      className={`px-2.5 py-1 text-[9px] rounded font-black uppercase border bg-white ${
                        msg.status === 'unread' ? 'bg-orange-50 border-orange-200 text-[#F97316]' :
                        msg.status === 'replied' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                        'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="contacted">Contacted</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Plaintext body comment */}
                <p className="text-slate-500 text-xs font-semibold leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans whitespace-pre-wrap">
                  "{msg.message}"
                </p>

                {/* Actions footer bar */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-wider">
                    {!isReplying && msg.status !== 'replied' && (
                      <button
                        onClick={() => {
                          setReplyingId(msg.id);
                          setReplyText('');
                        }}
                        className="text-[#0A2C66] hover:text-[#F97316] flex items-center gap-1 transition-colors"
                      >
                        <Reply className="h-3.5 w-3.5" />
                        Reply Inline
                      </button>
                    )}
                    {msg.status === 'replied' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Replied
                      </span>
                    )}
                  </div>
                </div>

                {/* Replying state panel */}
                {isReplying && (
                  <form onSubmit={(e) => handleReplySubmit(e, msg.id)} className="space-y-3 pt-2">
                    <label className="block text-[9px] font-black text-slate-400 uppercase">Write professionally reply email:</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Dear Dr. Akshatha, thank you for registering with Turenakx Staffing. Our head of clinical recruitment will review Apollo Healthcare's nurses mandates..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-slate-50 focus:bg-white resize-none text-slate-700 leading-relaxed"
                    />
                    <div className="flex gap-2 text-[10px] uppercase font-black tracking-wider">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0A2C66] text-white rounded flex items-center gap-1 hover:bg-slate-800 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Send Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingId(null)}
                        className="px-4 py-2 border rounded bg-white text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
