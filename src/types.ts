/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
  duration: string;
  category: string;
  authorAvatar: string;
}

export const CATEGORIES = [
  "For You",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Tech",
  "Movies"
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Vibey Lo-fi Mix for Studying and Chilling",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&h=338&fit=crop",
    channel: "Lofi Library",
    views: "1.2M views",
    duration: "2:45:00",
    category: "Music",
    authorAvatar: "https://i.pravatar.cc/150?u=lofi"
  },
  {
    id: "2",
    title: "Space Exploration: To the Moon and Beyond",
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&h=338&fit=crop",
    channel: "Cosmos Daily",
    views: "850K views",
    duration: "15:20",
    category: "Tech",
    authorAvatar: "https://i.pravatar.cc/150?u=space"
  },
  {
    id: "3",
    title: "Epic Gaming Highlights 2024",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&h=338&fit=crop",
    channel: "Pro Gamer Hub",
    views: "3.5M views",
    duration: "10:05",
    category: "Gaming",
    authorAvatar: "https://i.pravatar.cc/150?u=game"
  },
  {
    id: "4",
    title: "Traditional Ramen Recipe - Step by Step",
    thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&h=338&fit=crop",
    channel: "The Chef's Table",
    views: "2.1M views",
    duration: "12:45",
    category: "For You",
    authorAvatar: "https://i.pravatar.cc/150?u=chef"
  },
  {
    id: "5",
    title: "Breaking News: Major Tech Event Announced",
    thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&h=338&fit=crop",
    channel: "News Central",
    views: "440K views",
    duration: "05:30",
    category: "News",
    authorAvatar: "https://i.pravatar.cc/150?u=news"
  },
  {
    id: "6",
    title: "World's Fastest Goal in Football History",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&h=338&fit=crop",
    channel: "Sports Arena",
    views: "5.8M views",
    duration: "03:15",
    category: "Sports",
    authorAvatar: "https://i.pravatar.cc/150?u=sports"
  },
  {
    id: "7",
    title: "Futuristic Car Concept Reveal",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&h=338&fit=crop",
    channel: "Auto Vision",
    views: "1.1M views",
    duration: "08:20",
    category: "Tech",
    authorAvatar: "https://i.pravatar.cc/150?u=auto"
  },
  {
    id: "8",
    title: "Nature's Calm: Forest Stream Soundscape",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&h=338&fit=crop",
    channel: "Nature Therapy",
    views: "250K views",
    duration: "1:00:00",
    category: "For You",
    authorAvatar: "https://i.pravatar.cc/150?u=nature"
  }
];
