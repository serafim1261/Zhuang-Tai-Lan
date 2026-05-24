import { useGame } from '../../context/GameContext';
import { ForumPost, ForumTab } from '../../types/game';
import { useState } from 'react';
import { ShieldAlert, Coins, BookOpen, MessageSquare, Lock } from 'lucide-react';

const tabConfig: { id: ForumTab; label: string; color: string; icon: React.ReactNode }[] = [
  { id: 'announcement', label: '官方公告', color: '#c41e3a', icon: <ShieldAlert size={12} /> },
  { id: 'auction', label: '拍卖行', color: '#f0c040', icon: <Coins size={12} /> },
  { id: 'survival', label: '生存法则', color: '#7ec8e3', icon: <BookOpen size={12} /> },
  { id: 'discussion', label: '交流', color: '#888', icon: <MessageSquare size={12} /> },
  { id: 'blackmarket', label: '黑市', color: '#7b2fbe', icon: <Lock size={12} /> },
];

export default function ForumPanel() {
  const { state } = useGame();
  const [tab, setTab] = useState<ForumTab>('announcement');
  const posts = state.forumPosts.filter(p => p.tab === tab);
  const tabCfg = tabConfig.find(t => t.id === tab)!;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(240,192,64,0.06)', borderBottom: '1px solid rgba(240,192,64,0.12)', padding: '14px 18px' }}>
        <div style={{ color: '#f0c040', fontSize: 14, fontWeight: 'bold', letterSpacing: 4 }}>界门论坛</div>
        <div style={{ color: 'rgba(240,192,64,0.4)', fontSize: 9 }}>GATE FORUM // DARK-WEB</div>
      </div>

      {/* Forum Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'auto' }}>
        {tabConfig.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, minWidth: 56, padding: '10px 4px', fontSize: 8, letterSpacing: 1, cursor: 'pointer',
              background: 'transparent', border: 'none', borderBottom: tab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
              color: tab === t.id ? t.color : '#555', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
            }}>
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} color={tabCfg.color} />
        ))}
        {posts.length === 0 && <Empty text="此板块暂无帖子" />}
      </div>
    </div>
  );
}

function PostCard({ post, color }: { post: ForumPost; color: string }) {
  return (
    <div className="glass" style={{
      padding: 14, borderRadius: 6, marginBottom: 10, borderLeft: `2px solid ${color}`,
      transition: 'all 0.2s ease-out', cursor: post.isLocked ? 'default' : 'pointer',
      opacity: post.isLocked ? 0.6 : 1, position: 'relative'
    }}
      onMouseEnter={e => { if (!post.isLocked) { e.currentTarget.style.transform = 'scale(1.02)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
      {post.isLocked && (
        <div style={{ position: 'absolute', top: 8, right: 8, color: '#c41e3a', opacity: 0.6 }}>
          <Lock size={12} />
        </div>
      )}
      <div style={{ color: '#ccc', fontSize: 12, fontWeight: 'bold', marginBottom: 4, paddingRight: post.isLocked ? 20 : 0 }}>{post.title}</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 9 }}>
        <span style={{ color }}>{post.author}</span>
        <span style={{ color: '#444' }}>{new Date(post.timestamp).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}</span>
      </div>
      <div style={{ color: '#666', fontSize: 10, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.content.slice(0, 80)}...</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {post.tags.map(tag => (
          <span key={tag} style={{ padding: '1px 8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, color: '#666', fontSize: 8 }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ textAlign: 'center', padding: 40, color: '#444', fontSize: 11 }}>{text}</div>;
}
