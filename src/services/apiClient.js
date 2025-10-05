import { tokenManager } from './tokenManager';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

class ApiClient {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = tokenManager.getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Token ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        
        if (response.status === 401) {
            // TODO: Implement refresh token functionality when backend supports it
            tokenManager.clearTokens();
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
        // TODO: Implement refresh token functionality when backend supports it
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