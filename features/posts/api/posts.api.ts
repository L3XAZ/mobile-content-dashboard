import { jsonPlaceholderClient } from '@/shared/api/client';
import { Post, Comment } from '../types';

export const getPosts = async (): Promise<Post[]> => {
  const response = await jsonPlaceholderClient.get<Post[]>('/posts');
  return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await jsonPlaceholderClient.get<Post>(`/posts/${id}`);
  return response.data;
};

export const getPostComments = async (postId: number): Promise<Comment[]> => {
  const response = await jsonPlaceholderClient.get<Comment[]>(`/posts/${postId}/comments`);
  return response.data;
};
