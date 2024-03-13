import { supabase } from './client';

export const fetchAccessToken = async () => {
  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Failed to retrieve session');
  }

  const accessToken = session?.session?.provider_token;
  if (!accessToken) {
    throw new Error('No access token available');
  }

  return accessToken;
};
