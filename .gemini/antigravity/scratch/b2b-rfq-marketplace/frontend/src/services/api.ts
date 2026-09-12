const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({ message: 'Failed to parse JSON server response' }));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? data.errors.map((e: any) => e.message).join(', ') : 'An unexpected error occurred');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body?: any): Promise<T> => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(response);
  },
};
