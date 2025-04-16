
/**
 * API client for making requests to the Java backend
 */

const API_URL = 'http://localhost:8080/api';

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  credentials?: RequestCredentials;
  mode?: RequestMode; // Add the missing mode property
};

export async function get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  
  // Add query parameters
  if (options.params) {
    Object.keys(options.params).forEach(key => {
      url.searchParams.append(key, options.params![key]);
    });
  }
  
  // Add authorization header
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'X-CSRF-TOKEN': 'disabled', // Add explicit CSRF token disable header
    ...options.headers,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
    credentials: options.credentials || 'include',
    mode: options.mode || 'cors',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  
  if (response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  return await response.json();
}

export async function post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Add authorization header
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': 'disabled', // Add explicit CSRF token disable header
    ...options.headers,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log('Sending POST request to:', url);
  console.log('Headers:', headers);
  console.log('Request body:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: options.credentials || 'include',
    mode: options.mode || 'cors',
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  
  if (response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  return await response.json();
}

export async function put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Add authorization header
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': 'disabled', // Add explicit CSRF token disable header
    ...options.headers,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
    credentials: options.credentials || 'include',
    mode: options.mode || 'cors',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  
  if (response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  return await response.json();
}

export async function del<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Add authorization header
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'X-CSRF-TOKEN': 'disabled', // Add explicit CSRF token disable header
    ...options.headers,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
    credentials: options.credentials || 'include',
    mode: options.mode || 'cors',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  
  if (response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  return await response.json();
}
