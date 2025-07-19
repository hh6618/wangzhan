'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
}

export default function PostList({ initialPosts, user }: { initialPosts: Post[], user: any }) {
  const [posts, setPosts] = useState(initialPosts);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts((prevPosts) => [...prevPosts, payload.new as Post]);
        } else if (payload.eventType === 'DELETE') {
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === payload.new.id ? (payload.new as Post) : post))
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const { error: deleteError } = await supabase.from('posts').delete().eq('id', postId);
      if (deleteError) {
        alert('Error deleting post: ' + deleteError.message);
      } else {
        alert('Post deleted successfully!');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-700">{post.content}</p>
          <p className="text-sm text-gray-500 mt-4">Posted by: {post.user_id}</p>
          {user && user.id === post.user_id && (
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
              {/* <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm">
                Edit
              </button> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}