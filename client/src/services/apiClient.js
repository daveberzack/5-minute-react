import { tokenManager } from './tokenManager';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

class ApiClient {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = tokenManager.getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        
        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                config.headers.Authorization = `Bearer ${tokenManager.getToken()}`;
                return this.handleResponse(await fetch(url, config));
            }
            throw new Error('Authentication failed');
        }

        return this.handleResponse(response);
    }

    async handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    }

    async refreshToken() {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                tokenManager.setTokens(data.data.token, data.data.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        tokenManager.clearTokens();
        return false;
    }

    get(endpoint) { 
        return this.request(endpoint, { method: 'GET' }); 
    }
    
    post(endpoint, data) { 
        return this.request(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(data) 
        }); 
    }
    
    put(endpoint, data) { 
        return this.request(endpoint, { 
            method: 'PUT', 
            body: JSON.stringify(data) 
        }); 
    }
    
    delete(endpoint) { 
        return this.request(endpoint, { method: 'DELETE' }); 
    }
}

export const apiClient = new ApiClient();