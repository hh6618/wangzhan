import { supabase } from '../../lib/supabase';
import PostForm from '../../components/PostForm';
import PostList from '../../components/PostList';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
  const supabaseServer = createServerComponentClient({ cookies });
  const { data: { user } } = await supabaseServer.auth.getUser();

  const { data: posts, error } = await supabase.from('posts').select('*');

  if (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Posts</h1>
      {user && <PostForm />}
      <PostList initialPosts={posts} user={user} />
    </div>
  );
}
