'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, FileText, Newspaper, Briefcase, Users, MessageSquare, Send, Sparkles, ArrowRight, ExternalLink, Loader2, Bot } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import Link from 'next/link';

const SUGGESTIONS = [
  { text: 'Find PDF documents', icon: FileText, color: 'from-emerald-400 to-emerald-600' },
  { text: 'Search news articles', icon: Newspaper, color: 'from-teal-400 to-teal-600' },
  { text: 'Show recent contacts', icon: MessageSquare, color: 'from-blue-400 to-blue-600' },
  { text: 'Find board members', icon: Users, color: 'from-purple-400 to-purple-600' },
  { text: 'Search job postings', icon: Briefcase, color: 'from-orange-400 to-orange-600' },
];

// Category keywords for intent detection
const CATEGORY_KEYWORDS = {
  pdf: ['pdf', 'document', 'doc', 'report', 'annual', 'policy', 'financial', 'disclosure'],
  news: ['news', 'article', 'media', 'update', 'post'],
  contact: ['contact', 'message', 'inbox', 'mail'],
  job: ['job', 'career', 'hiring', 'vacancy'],
  board: ['board', 'director', 'member', 'committee'],
};

// Sort results by relevance to search term
const sortByRelevance = (results, searchTerm) => {
  const lower = searchTerm.toLowerCase();
  return [...results].sort((a, b) => {
    const aTitle = (a.title || '').toLowerCase();
    const bTitle = (b.title || '').toLowerCase();
    // Priority 1: title starts with search term
    const aStartsWith = aTitle.startsWith(lower) ? 0 : 1;
    const bStartsWith = bTitle.startsWith(lower) ? 0 : 1;
    if (aStartsWith !== bStartsWith) return aStartsWith - bStartsWith;
    // Priority 2: title contains full search term
    const aContains = aTitle.includes(lower) ? 0 : 1;
    const bContains = bTitle.includes(lower) ? 0 : 1;
    return aContains - bContains;
  });
};

// Group results by type, order groups by count, limit per category and total
const groupAndLimit = (results) => {
  const groups = {};
  results.forEach(r => {
    if (!groups[r.type]) groups[r.type] = [];
    groups[r.type].push(r);
  });

  // Sort groups by count descending
  const sortedGroups = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

  let total = 0;
  const limited = [];
  for (const [, items] of sortedGroups) {
    const take = Math.min(items.length, 5, 10 - total);
    if (take <= 0) break;
    limited.push(...items.slice(0, take));
    total += take;
  }
  return limited;
};

export default function VaswaniBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your Vaswani Assistant 👋\n\nI can help you quickly find PDFs, news, contacts, jobs & board members. Just type or tap a suggestion below!' }
  ]);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    return `${baseUrl}/uploads/${encodeURIComponent(path)}`;
  };

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: q }]);
    setQuery('');
    setSearching(true);

    const lowerQ = q.toLowerCase();

    try {
      let results = [];

      const isPDF = CATEGORY_KEYWORDS.pdf.some(k => lowerQ.includes(k));
      const isNews = CATEGORY_KEYWORDS.news.some(k => lowerQ.includes(k));
      const isContact = CATEGORY_KEYWORDS.contact.some(k => lowerQ.includes(k));
      const isJob = CATEGORY_KEYWORDS.job.some(k => lowerQ.includes(k));
      const isBoard = CATEGORY_KEYWORDS.board.some(k => lowerQ.includes(k));

      const noKeywordMatch = !isPDF && !isNews && !isContact && !isJob && !isBoard;

      // If no keyword matches, search both documents and news in parallel
      if (noKeywordMatch) {
        try {
          const [docsRes, newsRes] = await Promise.allSettled([
            adminApi.get('/documents', { params: { search: q } }),
            adminApi.get('/news', { params: { search: q, limit: 5 } }),
          ]);
          if (docsRes.status === 'fulfilled') {
            const docs = docsRes.value.data.documents || docsRes.value.data.docs || [];
            results.push(...docs.slice(0, 5).map(d => ({
              type: 'document',
              title: d.title || d.name,
              sub: d.category || 'Document',
              date: d.createdAt,
              url: d.fileUrl || (d.file ? getFileUrl(d.file) : null),
              link: '/admin/documents',
            })));
          }
          if (newsRes.status === 'fulfilled') {
            const news = newsRes.value.data.news || [];
            results.push(...news.slice(0, 5).map(n => ({
              type: 'news',
              title: n.title,
              sub: n.category || 'News',
              date: n.createdAt,
              slug: n.slug,
              articleUrl: n.slug ? `/news/${n.slug}` : null,
              link: '/admin/news',
            })));
          }
        } catch {}
      } else {
        // Keyword-based search
        if (isPDF) {
          try {
            const { data } = await adminApi.get('/documents', { params: { search: q } });
            const docs = data.documents || data.docs || [];
            if (docs.length > 0) {
              results.push(...docs.slice(0, 5).map(d => ({
                type: 'document',
                title: d.title || d.name,
                sub: d.category || 'Document',
                date: d.createdAt,
                url: d.fileUrl || (d.file ? getFileUrl(d.file) : null),
                link: '/admin/documents',
              })));
            }
          } catch {}
        }

        if (isNews) {
          try {
            const { data } = await adminApi.get('/news', { params: { search: q, limit: 5 } });
            const news = data.news || [];
            if (news.length > 0) {
              results.push(...news.slice(0, 5).map(n => ({
                type: 'news',
                title: n.title,
                sub: n.category || 'News',
                date: n.createdAt,
                slug: n.slug,
                articleUrl: n.slug ? `/news/${n.slug}` : null,
                link: '/admin/news',
              })));
            }
          } catch {}
        }

        if (isContact) {
          try {
            const { data } = await adminApi.get('/contacts', { params: { search: q } });
            const contacts = data.contacts || [];
            if (contacts.length > 0) {
              results.push(...contacts.slice(0, 5).map(c => ({
                type: 'contact',
                title: c.name,
                sub: c.email,
                date: c.createdAt,
                link: '/admin/contacts',
              })));
            }
          } catch {}
        }

        if (isJob) {
          try {
            const { data } = await adminApi.get('/careers', { params: { search: q } });
            const jobs = data.jobs || [];
            if (jobs.length > 0) {
              results.push(...jobs.slice(0, 5).map(j => ({
                type: 'job',
                title: j.title,
                sub: j.location || j.department || 'Career',
                date: j.createdAt,
                link: '/admin/careers',
              })));
            }
          } catch {}
        }

        if (isBoard) {
          try {
            const { data } = await adminApi.get('/board-members');
            const members = data.members || [];
            const filtered = members.filter(m =>
              m.name?.toLowerCase().includes(lowerQ.replace(/board|director|member|committee|find|show|search/g, '').trim()) ||
              m.designation?.toLowerCase().includes(lowerQ)
            );
            const toShow = filtered.length > 0 ? filtered : members;
            if (toShow.length > 0) {
              results.push(...toShow.slice(0, 5).map(m => ({
                type: 'board',
                title: m.name,
                sub: m.designation || 'Director',
                link: '/admin/board-members',
              })));
            }
          } catch {}
        }
      }

      if (results.length > 0) {
        // Apply relevance sorting and grouping/limiting
        const sorted = sortByRelevance(results, q);
        const limited = groupAndLimit(sorted);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `Found ${limited.length} result${limited.length > 1 ? 's' : ''} for "${q}":`,
          results: limited,
        }]);
      } else {
        setMessages(prev => [...prev, { type: 'bot', text: `I couldn't find anything for "${q}".\n\nTry searching for:\n• Document names (e.g. "VIL 2018", "annual report")\n• News titles or categories\n• Contact names\n• Job titles` }]);
      }
    } catch {
      setMessages(prev => [...prev, { type: 'bot', text: 'Something went wrong. Please try again.' }]);
    }

    setSearching(false);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'document': return <FileText size={15} className="text-emerald-500" />;
      case 'news': return <Newspaper size={15} className="text-teal-500" />;
      case 'contact': return <MessageSquare size={15} className="text-blue-500" />;
      case 'job': return <Briefcase size={15} className="text-orange-500" />;
      case 'board': return <Users size={15} className="text-purple-500" />;
      default: return <Search size={15} className="text-gray-400" />;
    }
  };

  const getResultBg = (type) => {
    switch (type) {
      case 'document': return 'hover:border-emerald-200 hover:bg-emerald-50/40';
      case 'news': return 'hover:border-teal-200 hover:bg-teal-50/40';
      case 'contact': return 'hover:border-blue-200 hover:bg-blue-50/40';
      case 'job': return 'hover:border-orange-200 hover:bg-orange-50/40';
      case 'board': return 'hover:border-purple-200 hover:bg-purple-50/40';
      default: return 'hover:border-gray-200';
    }
  };

  return (
    <>
      {/* Bot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-[90] transition-all duration-500 ease-out ${isOpen ? 'scale-90' : 'scale-100 hover:scale-110'}`}
        title="Vaswani Bot"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-gray-900 shadow-gray-900/30 rotate-180' : 'bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 shadow-teal-500/40'}`}>
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <div className="relative">
              <Bot size={28} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white animate-pulse" />
            </div>
          )}
        </div>
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20" />
            <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[90] w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-[28px] shadow-2xl shadow-black/10 border border-gray-200/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-400" style={{ height: '600px' }}>

          {/* Header */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-5 flex items-center gap-4 flex-shrink-0 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400 rounded-full blur-2xl" />
            </div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Bot size={24} className="text-white" />
            </div>
            <div className="relative flex-1">
              <h3 className="text-white font-black text-base tracking-tight">Vaswani Bot</h3>
              <p className="text-gray-400 text-[11px] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Always online • Smart Search
              </p>
            </div>
            <div className="relative flex items-center gap-2">
              <Sparkles size={18} className="text-teal-400/60" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50/80 to-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.type === 'bot' && (
                  <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.type === 'user'
                  ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg shadow-teal-500/20'
                  : 'bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm'}`}>
                  <p className={`text-[13px] whitespace-pre-line leading-relaxed ${msg.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                    {msg.text}
                  </p>

                  {/* Results */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.results.map((r, i) => (
                        <div key={i} className={`bg-gray-50/80 rounded-xl p-3 border border-gray-100 transition-all duration-200 group cursor-pointer ${getResultBg(r.type)}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                              {getResultIcon(r.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-gray-800 truncate leading-tight">{r.title}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                {r.sub}
                                {r.date ? ` • ${new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                              </p>
                            </div>
                            {/* Action buttons - always visible */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {/* Direct Action: Open PDF in new tab */}
                              {r.type === 'document' && r.url && (
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="w-8 h-8 bg-emerald-50 rounded-lg text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 shadow-sm transition-all duration-200 flex items-center justify-center"
                                  aria-label="Open document"
                                  title="Open PDF"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              )}
                              {/* Direct Action: Navigate to news article */}
                              {r.type === 'news' && r.articleUrl && (
                                <Link
                                  href={r.articleUrl}
                                  onClick={() => setIsOpen(false)}
                                  className="w-8 h-8 bg-teal-50 rounded-lg text-teal-600 hover:text-white hover:bg-teal-500 border border-teal-200 hover:border-teal-500 shadow-sm transition-all duration-200 flex items-center justify-center"
                                  aria-label="Go to news article"
                                  title="Read Article"
                                >
                                  <ArrowRight size={13} />
                                </Link>
                              )}
                              {/* Section Link (secondary) */}
                              {r.link && (
                                <Link
                                  href={r.link}
                                  onClick={() => setIsOpen(false)}
                                  className="w-8 h-8 bg-white rounded-lg text-gray-400 hover:text-teal-600 border border-gray-200 hover:border-teal-300 shadow-sm transition-all duration-200 flex items-center justify-center"
                                  aria-label="Go to section"
                                  title="Go to section"
                                >
                                  <ArrowRight size={11} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {searching && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[12px] text-gray-400 font-medium">Searching...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-white/80 backdrop-blur flex-shrink-0">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => handleSearch(s.text)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-white border border-gray-100 hover:border-teal-300 hover:shadow-md rounded-xl px-3 py-2 text-[11px] font-bold text-gray-600 hover:text-teal-700 transition-all duration-200">
                    <s.icon size={13} />
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50 focus-within:bg-white transition-all duration-200 px-4">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search documents, news, contacts..."
                className="flex-1 bg-transparent py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none font-medium"
                disabled={searching}
              />
              <button
                onClick={() => handleSearch()}
                disabled={!query.trim() || searching}
                className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white disabled:opacity-30 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 active:scale-95"
              >
                {searching ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
            <p className="text-center text-[9px] text-gray-300 font-medium mt-2 tracking-wide">Powered by Vaswani Industries</p>
          </div>
        </div>
      )}
    </>
  );
}
