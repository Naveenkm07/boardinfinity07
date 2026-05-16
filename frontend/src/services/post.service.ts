import api from './api';

export const postService = {
    async listPosts(params?: { company?: string; tag?: string; search?: string }) {
        const { data } = await api.get('/posts', { params });
        return data.data.posts;
    },

    async createPost(postData: { title: string; content: string; company: string; role?: string; tags: string[] }) {
        const { data } = await api.post('/posts', postData);
        return data.data.post;
    },

    async getPostById(id: string) {
        const { data } = await api.get(`/posts/${id}`);
        return data.data.post;
    },

    async upvotePost(id: string) {
        const { data } = await api.post(`/posts/${id}/upvote`);
        return data.data.upvotes;
    },

    async addComment(id: string, text: string) {
        const { data } = await api.post(`/posts/${id}/comments`, { text });
        return data.data.comments;
    },
};
