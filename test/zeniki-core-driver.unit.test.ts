/**
 * @fileoverview Unit tests for ZenikiCoreDriver base class.
 * Tests HTTP methods, interceptors, authentication, and error handling.
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ZenikiCoreDriver } from '../src/core/base/zeniki-core-driver';

// Create a concrete implementation for testing the abstract class
class TestCoreDriver extends ZenikiCoreDriver {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  // Expose protected methods for testing
  public testGet<T>(url: string, config?: AxiosRequestConfig) {
    return this.get<T>(url, config);
  }

  public testPost<T, D>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.post<T, D>(url, data, config);
  }

  public testPut<T, D>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.put<T, D>(url, data, config);
  }

  public testPatch<T, D>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.patch<T, D>(url, data, config);
  }

  public testDelete<T>(url: string, config?: AxiosRequestConfig) {
    return this.delete<T>(url, config);
  }

  public getClient() {
    return this.client;
  }

  public getToken() {
    return this.token;
  }

  public getConfig() {
    return this.config;
  }
}

// Mock axios
jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: jest.fn(),
  };
});

describe('ZenikiCoreDriver', () => {
  let driver: TestCoreDriver;
  let mockAxiosInstance: any;
  const mockConfig: AxiosRequestConfig = {
    baseURL: 'https://api.test.com',
    headers: {
      'Authorization': 'Token test-token-123',
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };

  beforeEach(() => {
    // Create mock axios instance with all required methods and interceptors
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
          eject: jest.fn(),
        },
        response: {
          use: jest.fn(),
          eject: jest.fn(),
        },
      },
    };

    // Mock axios.create to return our mock instance
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    // Create driver instance
    driver = new TestCoreDriver(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should create axios client with provided config', () => {
      expect(axios.create).toHaveBeenCalledWith(mockConfig);
    });

    it('should extract token from Authorization header', () => {
      expect(driver.getToken()).toBe('Token test-token-123');
    });

    it('should store the original configuration', () => {
      expect(driver.getConfig()).toEqual(mockConfig);
    });

    it('should initialize request and response interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1);
    });

    it('should work without Authorization header', () => {
      const configWithoutAuth = { baseURL: 'https://api.test.com' };
      const driverWithoutAuth = new TestCoreDriver(configWithoutAuth);
      expect(driverWithoutAuth.getToken()).toBeUndefined();
    });
  });

  describe('HTTP Methods', () => {
    const mockResponse: AxiosResponse = {
      data: { id: 1, name: 'test' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any,
    };

    describe('GET requests', () => {
      it('should make GET request with correct parameters', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

        const result = await driver.testGet('/test');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
        expect(result).toBe(mockResponse);
      });

      it('should make GET request with additional config', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);
        const requestConfig = { params: { limit: 10 } };

        const result = await driver.testGet('/test', requestConfig);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', requestConfig);
        expect(result).toBe(mockResponse);
      });

      it('should handle GET request errors', async () => {
        const error = new Error('Network error');
        mockAxiosInstance.get.mockRejectedValueOnce(error);

        await expect(driver.testGet('/test')).rejects.toThrow('Network error');
      });
    });

    describe('POST requests', () => {
      it('should make POST request with data', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);
        const data = { name: 'test', email: 'test@example.com' };

        const result = await driver.testPost('/users', data);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', data, undefined);
        expect(result).toBe(mockResponse);
      });

      it('should make POST request without data', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        const result = await driver.testPost('/action');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/action', undefined, undefined);
        expect(result).toBe(mockResponse);
      });

      it('should make POST request with data and config', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);
        const data = { name: 'test' };
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        const result = await driver.testPost('/upload', data, config);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/upload', data, config);
        expect(result).toBe(mockResponse);
      });
    });

    describe('PUT requests', () => {
      it('should make PUT request with data', async () => {
        mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);
        const data = { id: 1, name: 'updated', email: 'updated@example.com' };

        const result = await driver.testPut('/users/1', data);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', data, undefined);
        expect(result).toBe(mockResponse);
      });

      it('should make PUT request with config', async () => {
        mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);
        const data = { name: 'updated' };
        const config = { params: { force: true } };

        const result = await driver.testPut('/users/1', data, config);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', data, config);
        expect(result).toBe(mockResponse);
      });
    });

    describe('PATCH requests', () => {
      it('should make PATCH request with partial data', async () => {
        mockAxiosInstance.patch.mockResolvedValueOnce(mockResponse);
        const data = { email: 'newemail@example.com' };

        const result = await driver.testPatch('/users/1', data);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', data, undefined);
        expect(result).toBe(mockResponse);
      });

      it('should make PATCH request with config', async () => {
        mockAxiosInstance.patch.mockResolvedValueOnce(mockResponse);
        const data = { active: false };
        const config = { params: { validate: true } };

        const result = await driver.testPatch('/users/1', data, config);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', data, config);
        expect(result).toBe(mockResponse);
      });
    });

    describe('DELETE requests', () => {
      it('should make DELETE request', async () => {
        mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

        const result = await driver.testDelete('/users/1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', undefined);
        expect(result).toBe(mockResponse);
      });

      it('should make DELETE request with config', async () => {
        mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);
        const config = { params: { force: true } };

        const result = await driver.testDelete('/users/1', config);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', config);
        expect(result).toBe(mockResponse);
      });
    });
  });

  describe('Interceptors', () => {
    let requestInterceptor: any;
    let responseInterceptor: any;

    beforeEach(() => {
      // Extract the interceptor functions
      requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    });

    describe('Request Interceptor', () => {
      it('should add authorization token to requests', () => {
        const config = { headers: {} };
        const result = requestInterceptor(config);

        expect(result.headers.Authorization).toBe('Token test-token-123');
      });

      it('should not add authorization if token is not available', () => {
        const driverWithoutToken = new TestCoreDriver({ baseURL: 'https://api.test.com' });
        const requestInterceptorWithoutToken = mockAxiosInstance.interceptors.request.use.mock.calls[1][0];
        
        const config = { headers: {} };
        const result = requestInterceptorWithoutToken(config);

        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should preserve existing headers', () => {
        const config = { 
          headers: { 
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          } 
        };
        const result = requestInterceptor(config);

        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Token test-token-123');
      });
    });

    describe('Response Interceptor', () => {
      it('should return response for successful requests', () => {
        const response = { data: {}, headers: {}, status: 200 };
        const result = responseInterceptor(response);

        expect(result).toBe(response);
      });

      it('should extract CSRF token from response headers', () => {
        const response = {
          data: {},
          headers: { 'x-csrf-token': 'csrf-token-123' },
          status: 200
        };
        
        const result = responseInterceptor(response);
        expect(result).toBe(response);
        // Note: The current implementation doesn't use the CSRF token,
        // but extracts it for potential future use
      });

      it('should handle various CSRF token header formats', () => {
        const testCases = [
          { 'x-csrf-token': 'token1' },
          { 'x-csrftoken': 'token2' },
          { 'csrf-token': 'token3' },
          { 'X-CSRFTOKEN': 'token4' },
        ];

        testCases.forEach(headers => {
          const response = { data: {}, headers, status: 200 };
          const result = responseInterceptor(response);
          expect(result).toBe(response);
        });
      });
    });

    describe('Error Interceptor', () => {
      let errorInterceptor: any;

      beforeEach(() => {
        // Extract the error interceptor function (second parameter to response interceptor)
        errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      });

      it('should handle 401 Unauthorized errors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const error = {
          response: { status: 401 },
          config: { headers: {} } as any
        };

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(consoleSpy).toHaveBeenCalledWith('Unauthorized');
        
        consoleSpy.mockRestore();
      });

      it('should handle other HTTP errors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const error = {
          response: { status: 500 },
          config: { headers: {} } as any
        };

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(consoleSpy).toHaveBeenCalledWith('Other error', 500);
        
        consoleSpy.mockRestore();
      });

      it('should handle network errors without response', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const error = {
          config: { headers: {} } as any,
          message: 'Network Error'
        };

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(consoleSpy).toHaveBeenCalledWith('Other error', undefined);
        
        consoleSpy.mockRestore();
      });
    });
  });

  describe('Abstract Methods', () => {
    it('should throw error for unimplemented next method', async () => {
      await expect(driver['next']('/test')).rejects.toThrow(
        'CustomDriver must implement next function with pagination support.'
      );
    });
  });

  describe('Type Safety', () => {
    interface TestUser {
      id: number;
      name: string;
      email: string;
    }

    interface CreateUserRequest {
      name: string;
      email: string;
    }

    it('should maintain type safety for GET requests', async () => {
      const mockUser: TestUser = { id: 1, name: 'John', email: 'john@test.com' };
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockUser, status: 200 });

      const response = await driver.testGet<TestUser>('/users/1');
      
      // TypeScript should infer the correct type
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('John');
      expect(response.data.email).toBe('john@test.com');
    });

    it('should maintain type safety for POST requests', async () => {
      const createRequest: CreateUserRequest = { name: 'Jane', email: 'jane@test.com' };
      const mockUser: TestUser = { id: 2, name: 'Jane', email: 'jane@test.com' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockUser, status: 201 });

      const response = await driver.testPost<TestUser, CreateUserRequest>('/users', createRequest);
      
      expect(response.data.id).toBe(2);
      expect(response.data.name).toBe('Jane');
    });
  });
});
