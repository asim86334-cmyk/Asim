/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  TrendingUp, 
  Download, 
  Library, 
  Search, 
  Bell, 
  Menu,
  Play,
  CheckCircle2,
  MoreVertical,
  ArrowDown,
  Clock,
  ThumbsUp,
  Share2,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from './lib/firebase';
import { MOCK_VIDEOS, CATEGORIES, Video } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [downloads, setDownloads] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [analyzedVideo, setAnalyzedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error("Facebook login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredVideos = useMemo(() => {
    return MOCK_VIDEOS.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.channel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'For You' || v.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const trendingVideos = useMemo(() => {
    return [...MOCK_VIDEOS].sort((a, b) => {
      const aViews = parseFloat(a.views);
      const bViews = parseFloat(b.views);
      return bViews - aViews;
    });
  }, []);

  const handleDownload = (video: Video) => {
    setAnalyzedVideo(video);
    setShowQualityModal(true);
  };

  const startDownload = () => {
    if (!analyzedVideo) return;
    
    setShowQualityModal(false);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          if (!downloads.find(d => d.id === analyzedVideo.id)) {
            setDownloads([...downloads, analyzedVideo]);
          }
          setTimeout(() => setDownloadProgress(null), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setIsAnalyzing(true);
    // Simulate analyzing any platform URL
    setTimeout(() => {
      const mockAnalyzed: Video = {
        id: `custom-${Date.now()}`,
        title: `Video from ${new URL(urlInput).hostname}`,
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&h=338&fit=crop",
        channel: "External Web Video",
        views: "N/A",
        duration: "04:20",
        category: "External",
        authorAvatar: "https://i.pravatar.cc/150?u=web"
      };
      setAnalyzedVideo(mockAnalyzed);
      setIsAnalyzing(false);
      setShowQualityModal(true);
    }, 1500);
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"
        />
        <p className="text-gray-400 font-medium animate-pulse">Launching SnapStream...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center space-y-6">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-red-600/30">
                <Play className="w-10 h-10 fill-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">SnapStream</h1>
              <p className="text-gray-400 font-medium max-w-[280px] mx-auto">
                Explore, stream, and download videos from any platform.
              </p>
            </div>

            <div className="grid gap-3 pt-8">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-4 w-full py-4.5 bg-white text-black rounded-2xl font-bold transition-all hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
                Continue with Google
              </button>
              <button 
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-4 w-full py-4.5 bg-[#1877F2] text-white rounded-2xl font-bold transition-all hover:bg-[#166FE5] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/20"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-widest leading-loose">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure, Encrypted Login
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0F0F0F] text-white font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-[#272727] flex flex-col hidden lg:flex shrink-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">SnapStream</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <SidebarItem 
            icon={<Home className="w-5 h-5" />} 
            label="Home" 
            active={activeTab === 'Home'} 
            onClick={() => setActiveTab('Home')}
          />
          <SidebarItem 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Trending" 
            active={activeTab === 'Trending'} 
            onClick={() => setActiveTab('Trending')}
          />
          <SidebarItem 
            icon={<Download className="w-5 h-5" />} 
            label="Downloads" 
            badge={downloads.length > 0 ? downloads.length : undefined}
            active={activeTab === 'Downloads'} 
            onClick={() => setActiveTab('Downloads')}
          />
          <SidebarItem 
            icon={<Library className="w-5 h-5" />} 
            label="Library" 
            active={activeTab === 'Library'} 
            onClick={() => setActiveTab('Library')}
          />
        </nav>

        <div className="p-4 border-t border-[#272727]">
          <div className="group relative">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#272727] transition-all cursor-pointer hover:bg-[#3F3F3F]">
              <img src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} className="w-8 h-8 rounded-full border border-white/10" alt="User" />
              <div className="flex-1 min-w-0 md:hidden lg:block">
                <p className="text-sm font-medium truncate">{user.displayName || 'Snap User'}</p>
                <p className="text-[10px] text-gray-400 truncate uppercase tracking-tighter font-bold">Standard Member</p>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400 lg:block hidden" />
            </div>
            
            <div className="absolute bottom-full left-0 right-0 mb-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-30">
               <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-2 shadow-2xl">
                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-600/10 text-red-500 transition-colors font-bold text-sm"
                 >
                   <LogOut className="w-4 h-4" />
                   Sign Out
                 </button>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 px-4 md:px-6 border-b border-[#272727] flex items-center justify-between gap-4 sticky top-0 bg-[#0F0F0F] z-10">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">SnapStream</span>
          </div>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#121212] border border-[#272727] rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-2 hover:bg-[#272727] rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-[#0F0F0F]"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'Home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Downloader Section */}
                <div className="mb-8 p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-3xl border border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-black tracking-tight">Any-Platform Downloader</h2>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Paste Link from YouTube, Instagram, Facebook, etc.</p>
                    </div>
                    <form onSubmit={handleUrlSubmit} className="flex-1 max-w-xl flex gap-2">
                       <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="url" 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-red-600 transition-all font-mono text-gray-300"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            required
                          />
                       </div>
                       <button 
                        type="submit"
                        disabled={isAnalyzing}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 shrink-0"
                       >
                         {isAnalyzing ? 'Analyzing...' : 'Fetch'}
                       </button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                        activeCategory === cat 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'bg-[#272727] text-white border-transparent hover:bg-[#3F3F3F]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredVideos.map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onPlay={() => setSelectedVideo(video)}
                      onDownload={() => handleDownload(video)}
                      isDownloaded={downloads.some(d => d.id === video.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Trending' && (
              <motion.div 
                key="trending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-bold">Trending Content</h2>
                </div>
                <div className="space-y-4">
                  {trendingVideos.map((video, index) => (
                    <TrendingVideoRow 
                      key={video.id} 
                      video={video} 
                      rank={index + 1}
                      onPlay={() => setSelectedVideo(video)}
                      onDownload={() => handleDownload(video)}
                      isDownloaded={downloads.some(d => d.id === video.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Downloads' && (
              <motion.div 
                key="downloads"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">My Downloads</h2>
                  <div className="text-xs text-gray-400 bg-[#272727] px-3 py-1 rounded-full">{downloads.length} videos</div>
                </div>

                {downloads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Download className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-lg font-medium">Ready for departure?</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Download your favorite videos and take them anywhere, even offline.</p>
                    <button 
                      onClick={() => setActiveTab('Home')}
                      className="mt-6 px-8 py-2.5 bg-red-600 hover:bg-red-700 transition-colors rounded-full font-bold text-sm"
                    >
                      Browse Videos
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {downloads.map(video => (
                      <VideoCard 
                        key={video.id} 
                        video={video} 
                        onPlay={() => setSelectedVideo(video)}
                        onDownload={() => {}}
                        isDownloaded={true}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Library' && (
              <motion.div 
                key="library"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <Clock className="w-5 h-5 text-red-500" /> History
                    </h3>
                    <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#272727]">
                      <p className="text-sm text-gray-400">Your recently watched videos will appear here.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <ThumbsUp className="w-5 h-5 text-red-500" /> Liked Videos
                    </h3>
                    <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#272727]">
                      <p className="text-sm text-gray-400">Keep track of what you love.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navbar */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0F0F0F]/95 backdrop-blur-md border-t border-[#272727] flex items-center justify-around lg:hidden z-20">
          <MobileNavButton 
            icon={<Home className="w-5 h-5" />} 
            active={activeTab === 'Home'} 
            onClick={() => setActiveTab('Home')}
            label="Home"
          />
          <MobileNavButton 
            icon={<TrendingUp className="w-5 h-5" />} 
            active={activeTab === 'Trending'} 
            onClick={() => setActiveTab('Trending')}
            label="Trending"
          />
          <MobileNavButton 
            icon={<Download className="w-5 h-5" />} 
            active={activeTab === 'Downloads'} 
            onClick={() => setActiveTab('Downloads')}
            label="Downloads"
          />
          <MobileNavButton 
            icon={<Library className="w-5 h-5" />} 
            active={activeTab === 'Library'} 
            onClick={() => setActiveTab('Library')}
            label="Library"
          />
        </nav>
      </main>

      {/* Quality Modal */}
      <AnimatePresence>
        {showQualityModal && analyzedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#1A1A1A] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent">
                <h3 className="text-lg font-bold">Select Download Quality</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{analyzedVideo.title}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Video Formats</p>
                  <QualityOption label="1080p Full HD" size="45 MB" onClick={startDownload} />
                  <QualityOption label="720p HD" size="24 MB" onClick={startDownload} />
                  <QualityOption label="480p" size="12 MB" onClick={startDownload} />
                </div>
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Audio Formats</p>
                  <QualityOption label="MP3 High Quality" size="8 MB" onClick={startDownload} icon={<Library className="w-4 h-4" />} />
                </div>
              </div>
              <div className="p-4 bg-black/20 flex justify-end">
                <button 
                  onClick={() => setShowQualityModal(false)}
                  className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Notification */}
      <AnimatePresence>
        {downloadProgress !== null && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-80 z-50"
          >
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Downloading Video...</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{downloadProgress}% Complete</p>
                </div>
                {downloadProgress === 100 && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="mt-3 h-1 w-full bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                  className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                />
              </div>
              {downloadProgress === 100 && (
                <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full md:h-auto md:max-w-5xl md:mx-4 flex flex-col md:rounded-3xl overflow-hidden bg-[#0F0F0F] border border-[#272727] shadow-2xl"
            >
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedVideo.thumbnail} 
                  className="w-full h-full object-cover opacity-50 blur-3xl absolute inset-0" 
                  alt="" 
                />
                <img 
                  src={selectedVideo.thumbnail} 
                  className="relative z-10 w-auto h-full object-contain" 
                  alt={selectedVideo.title} 
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/30 hover:scale-105 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                >
                  <MoreVertical className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight decoration-red-600 decoration-4">{selectedVideo.title}</h3>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 group cursor-pointer">
                        <img src={selectedVideo.authorAvatar} className="w-10 h-10 rounded-full border border-[#272727]" alt="" />
                        <div>
                          <p className="text-sm font-bold group-hover:text-red-500 transition-colors">{selectedVideo.channel}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Verified Creator</p>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-[#272727]"></div>
                      <p className="text-xs text-gray-400 font-medium">{selectedVideo.views} views</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDownload(selectedVideo)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg ${
                        downloads.some(d => d.id === selectedVideo.id)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20'
                      }`}
                    >
                      {downloads.some(d => d.id === selectedVideo.id) ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                      {downloads.some(d => d.id === selectedVideo.id) ? 'Saved' : 'Download'}
                    </button>
                    <button className="p-3 bg-[#1A1A1A] hover:bg-[#272727] rounded-full transition-colors text-white">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#272727]">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Up Next</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MOCK_VIDEOS.slice(0, 4).filter(v => v.id !== selectedVideo.id).map(video => (
                      <div 
                        key={video.id} 
                        onClick={() => setSelectedVideo(video)}
                        className="flex gap-3 hover:bg-[#1A1A1A] p-2 rounded-2xl cursor-pointer transition-colors group"
                      >
                         <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-[#272727]">
                            <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold line-clamp-2 leading-snug">{video.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-1">{video.channel}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, badge }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        active 
          ? 'bg-[#272727] text-white shadow-xl' 
          : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`${active ? 'text-red-500' : 'group-hover:text-red-400'} transition-colors`}>
          {icon}
        </span>
        <span className="text-sm font-semibold tracking-wide">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

interface MobileNavButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  label: string;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ icon, active, onClick, label }) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1 min-w-[64px]"
    >
      <div className={`p-1 transition-colors ${active ? 'text-red-500' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

interface VideoCardProps {
  video: Video;
  onPlay: () => void;
  onDownload: () => void;
  isDownloaded: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay, onDownload, isDownloaded }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 shadow-lg shadow-black/20 ring-1 ring-white/5">
        <img 
          src={video.thumbnail} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={video.title} 
        />
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-black tracking-wider border border-white/10 uppercase">
          {video.duration}
        </div>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300 ring-4 ring-white/10">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className={`absolute top-2 right-2 p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${
            isDownloaded 
              ? 'bg-green-500 text-white border-green-400 opacity-100' 
              : 'bg-black/40 text-white border-white/10 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:border-red-400'
          }`}
        >
          {isDownloaded ? <CheckCircle2 className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex gap-3 px-1">
        <img src={video.authorAvatar} className="w-10 h-10 rounded-full shrink-0 border-2 border-[#272727] p-0.5" alt="" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-bold line-clamp-2 leading-tight tracking-tight group-hover:text-red-500 transition-colors cursor-pointer" onClick={onPlay}>
            {video.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-gray-500">
            <span className="hover:text-white transition-colors">{video.channel}</span>
            <span className="w-1 h-1 rounded-full bg-[#272727]"></span>
            <span>{video.views}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface TrendingVideoRowProps {
  video: Video;
  rank: number;
  onPlay: () => void;
  onDownload: () => void;
  isDownloaded: boolean;
}

const TrendingVideoRow: React.FC<TrendingVideoRowProps> = ({ video, rank, onPlay, onDownload, isDownloaded }) => {
  return (
    <div className="flex items-center gap-4 group hover:bg-[#1A1A1A] p-2 md:p-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-[#272727]">
      <span className="text-2xl font-black text-[#272727] group-hover:text-red-500 transition-colors w-8 text-center">{rank}</span>
      <div 
        className="relative w-32 md:w-48 aspect-video rounded-xl overflow-hidden shrink-0"
        onClick={onPlay}
      >
        <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Play className="w-6 h-6 fill-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0" onClick={onPlay}>
        <h3 className="text-sm md:text-base font-bold line-clamp-1 group-hover:text-red-500 transition-colors">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1 font-semibold">{video.channel}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] bg-red-600/10 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{video.category}</span>
          <span className="text-[10px] text-gray-500">{video.views} watched</span>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        className={`p-3 rounded-full transition-all ${
          isDownloaded ? 'text-green-500' : 'text-gray-600 hover:text-red-500'
        }`}
      >
        {isDownloaded ? <CheckCircle2 className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
      </button>
    </div>
  );
}

function QualityOption({ label, size, onClick, icon = <Play className="w-4 h-4" /> }: { 
  label: string, 
  size: string, 
  onClick: () => void,
  icon?: React.ReactNode
}) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-black/40 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-500 group-hover:text-red-500 transition-colors">{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-600 group-hover:text-gray-200 transition-colors">{size}</span>
    </button>
  );
}


