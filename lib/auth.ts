import { createClient } from '@/lib/supabase/server';
import { Post } from '@/types/app';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUser() {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserProfile() {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error: errorAuth,
    } = await supabase.auth.getUser();

    if (!user) {
      throw errorAuth;
    }
    const { data, error } = await supabase
      .from('user_profiles')
      .select('username, name, avatar_url')
      .eq('id', user.id)
      .single();

    if (!data) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

interface UserProfile {
  avatar_url: string | null;
  background_url: string | null;
  created_at: string | null;
  description: string | null;
  has_followed: boolean;
  id: string;
  name: string | null;
  username: string;
  website_url: string | null;
}
export async function getUserProfileByUsername({
  username,
}: {
  username: string;
}) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('user_profile_view')
      .select('*')
      .eq('username', username)
      .single<UserProfile>();

    if (!data) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserPostsByUsername({
  username,
}: {
  username: string;
}) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('user_posts_feed')
      .select(`*`)
      .eq('username', username)
      .order('created_at', { ascending: false })
      .returns<Post[]>();

    if (!data) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserPostsBySessionAndFollowing() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('user_home_feed')
      .select(`*`)
      .order('created_at', { ascending: false })
      .returns<Post[]>();

    if (!data) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserSocialLinks() {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error: errorAuth,
    } = await supabase.auth.getUser();

    if (!user) {
      throw errorAuth;
    }

    const { data, error } = await supabase
      .from('user_social_links')
      .select('*')
      .eq('id', user?.id)
      .single();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserDetails() {
  const supabase = createClient();
  try {
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function signOut() {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
    redirect('/');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
