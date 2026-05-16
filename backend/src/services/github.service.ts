import axios from 'axios';

/**
 * GitHub Service — handles fetching public data from GitHub API.
 */
export class GitHubService {
    /**
     * Fetch top repositories for a given GitHub username.
     */
    static async fetchTopRepos(username: string) {
        try {
            // Remove full URL if provided, extract just the username
            const cleanUsername = username.replace('https://github.com/', '').replace('/', '');
            
            const response = await axios.get(`https://api.github.com/users/${cleanUsername}/repos`, {
                params: {
                    sort: 'stargazers',
                    per_page: 6,
                    direction: 'desc'
                }
            });

            return response.data.map((repo: any) => ({
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                stargazers_count: repo.stargazers_count,
                language: repo.language
            }));
        } catch (error: any) {
            console.error(`Error fetching GitHub repos for ${username}:`, error.message);
            throw new Error('Failed to fetch GitHub repositories');
        }
    }
}
