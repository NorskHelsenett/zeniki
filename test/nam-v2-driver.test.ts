/**
 * @fileoverview Unit tests for NAM v2 Driver
 * Tests NAMv2Driver methods with mocked native fetch API
 * Covers CRUD operations for NetBox integrators and API endpoints
 */

import { NAMv2Driver } from '../src/core/tools/nhn/nam-v2/nam-v2-driver';
import { NAMNetboxIntegrator, NAMAPIEndpoint, HTTPError } from '../src/types';
import { NAMResponse } from '../src/types/tools/nhn/nam-v2/shared/nam-response';
import { NAMParams } from '../src/types/tools/nhn/nam-v2/shared/nam-params';

// Mock fetch globally
global.fetch = jest.fn();

describe('NAMv2Driver', () => {
  let driver: NAMv2Driver;
  const mockBaseURL = 'https://nam.test.com/api/v2';
  const mockToken = 'test-token-123';

  beforeEach(() => {
    // Reset fetch mock before each test
    (fetch as jest.Mock).mockReset();

    // Initialize driver
    driver = new NAMv2Driver({
      baseURL: mockBaseURL,
      headers: {
        'Authorization': `Bearer ${mockToken}`,
        'Content-Type': 'application/json'
      }
    });
  });

  describe('NetBox Integrator Operations', () => {
    const mockIntegrator: NAMNetboxIntegrator = {
      _id: '674d7b2c8f1e4a1b2c3d4e5f',
      name: 'test-integrator',
      sync_priority: 'high',
      enabled: true,
      netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e60',
      fortigate_endpoints: []
    };

    describe('getNetboxIntegrator', () => {
      it('should fetch a single integrator by ID', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockIntegrator)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.netbox_integrators.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/674d7b2c8f1e4a1b2c3d4e5f/`,
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Authorization': `Bearer ${mockToken}`
            })
          })
        );
        expect(result).toEqual(mockIntegrator);
      });

      it('should include query parameters when provided', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockIntegrator)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const params: NAMParams = { expand: 1, expand_fields: ['endpoints'] };
        await driver.netbox_integrators.getNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', params);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/674d7b2c8f1e4a1b2c3d4e5f/?expand=1&expand_fields=endpoints`,
          expect.any(Object)
        );
      });

      it('should throw HTTPError on failed request', async () => {
        const mockResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found'
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(
          driver.netbox_integrators.getNetboxIntegrator('invalid-id')
        ).rejects.toThrow(HTTPError);
      });
    });

    describe('getNetboxIntegrators', () => {
      it('should fetch paginated list of integrators', async () => {
        const mockPaginatedResponse: NAMResponse<NAMNetboxIntegrator> = {
          count: 2,
          results: [mockIntegrator, { ...mockIntegrator, _id: '674d7b2c8f1e4a1b2c3d4e61' }]
        };

        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockPaginatedResponse)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.netbox_integrators.getNetboxIntegrators();

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockPaginatedResponse);
        expect(result?.results).toHaveLength(2);
      });

      it('should support filtering parameters', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue({ count: 1, results: [mockIntegrator] })
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const params: NAMParams = { q: 'high', pageSize: 50 };
        await driver.netbox_integrators.getNetboxIntegrators(params);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/?q=high&pageSize=50`,
          expect.any(Object)
        );
      });
    });

    describe('addNetboxIntegrator', () => {
      it('should create a new integrator', async () => {
        const newIntegrator: NAMNetboxIntegrator = {
          name: 'new-integrator',
          sync_priority: 'medium',
          enabled: true,
          netbox_endpoint: '674d7b2c8f1e4a1b2c3d4e60',
          fortigate_endpoints: []
        };

        const mockResponse = {
          ok: true,
          status: 201,
          statusText: 'Created',
          json: jest.fn().mockResolvedValue({ ...newIntegrator, _id: '674d7b2c8f1e4a1b2c3d4e62' })
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.netbox_integrators.addNetboxIntegrator(newIntegrator);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(newIntegrator)
          })
        );
        expect(result?._id).toBe('674d7b2c8f1e4a1b2c3d4e62');
      });

      it('should throw HTTPError on validation failure', async () => {
        const mockResponse = {
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(
          driver.netbox_integrators.addNetboxIntegrator({} as NAMNetboxIntegrator)
        ).rejects.toThrow(HTTPError);
      });
    });

    describe('patchNetboxIntegrator', () => {
      it('should partially update an integrator', async () => {
        const updates: Partial<NAMNetboxIntegrator> = { enabled: false, sync_priority: 'low' };
        const updatedIntegrator = { ...mockIntegrator, ...updates };

        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(updatedIntegrator)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.netbox_integrators.patchNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', updates);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/674d7b2c8f1e4a1b2c3d4e5f/`,
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify(updates)
          })
        );
        expect(result?.enabled).toBe(false);
        expect(result?.sync_priority).toBe('low');
      });
    });

    describe('updateNetboxIntegrator', () => {
      it('should fully replace an integrator', async () => {
        const replacement = {
          ...mockIntegrator,
          name: 'replaced-integrator'
        };

        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(replacement)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.netbox_integrators.updateNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', replacement);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/674d7b2c8f1e4a1b2c3d4e5f/`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(replacement)
          })
        );
        expect(result?.name).toBe('replaced-integrator');
      });
    });

    describe('deleteNetboxIntegrator', () => {
      it('should delete an integrator', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockIntegrator)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.netbox_integrators.deleteNetboxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/vendors/netbox/netbox-integrators/674d7b2c8f1e4a1b2c3d4e5f/`,
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result).toEqual(mockIntegrator);
      });

      it('should throw HTTPError when integrator not found', async () => {
        const mockResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found'
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(
          driver.netbox_integrators.deleteNetboxIntegrator('invalid-id')
        ).rejects.toThrow(HTTPError);
      });
    });
  });

  describe('API Endpoint Operations', () => {
    const mockEndpoint: NAMAPIEndpoint = {
      _id: '674d7b2c8f1e4a1b2c3d4e70',
      name: 'test-endpoint',
      vendor: 'fortinet',
      type: 'netbox',
      url: 'https://netbox.test.com',
      key: 'netbox-token',
      enabled: true
    };

    describe('getApiEndpoint', () => {
      it('should fetch a single endpoint by ID', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockEndpoint)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.api_endpoints.getApiEndpoint('674d7b2c8f1e4a1b2c3d4e70');

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/settings/api-endpoints/674d7b2c8f1e4a1b2c3d4e70/`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockEndpoint);
      });
    });

    describe('getApiEndpoints', () => {
      it('should fetch paginated list of endpoints', async () => {
        const mockPaginatedResponse: NAMResponse<NAMAPIEndpoint> = {
          count: 1,
          results: [mockEndpoint]
        };

        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockPaginatedResponse)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const params: NAMParams = { q: 'netbox' };
        const result = await driver.api_endpoints.getApiEndpoints(params);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/settings/api-endpoints/?q=netbox`,
          expect.any(Object)
        );
        expect(result?.results).toHaveLength(1);
      });
    });

    describe('addApiEndpoint', () => {
      it('should create a new endpoint', async () => {
        const newEndpoint: NAMAPIEndpoint = {
          name: 'new-endpoint',
          vendor: 'fortinet',
          type: 'fortigate',
          url: 'https://fortigate.test.com',
          enabled: true
        };

        const mockResponse = {
          ok: true,
          status: 201,
          statusText: 'Created',
          json: jest.fn().mockResolvedValue({ ...newEndpoint, _id: '674d7b2c8f1e4a1b2c3d4e71' })
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.api_endpoints.addApiEndpoint(newEndpoint);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/settings/api-endpoints/`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(newEndpoint)
          })
        );
        expect(result?._id).toBe('674d7b2c8f1e4a1b2c3d4e71');
      });
    });

    describe('patchApiEndpoint', () => {
      it('should partially update an endpoint', async () => {
        const updates: Partial<NAMAPIEndpoint> = { enabled: false, key: 'new-token' };
        const updatedEndpoint = { ...mockEndpoint, ...updates };

        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(updatedEndpoint)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.api_endpoints.patchApiEndpoint('674d7b2c8f1e4a1b2c3d4e70', updates);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/settings/api-endpoints/674d7b2c8f1e4a1b2c3d4e70/`,
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify(updates)
          })
        );
        expect(result?.enabled).toBe(false);
      });
    });

    describe('updateApiEndpoint', () => {
      it('should fully replace an endpoint', async () => {
        const replacement: NAMAPIEndpoint = {
          ...mockEndpoint,
          name: 'replaced-endpoint'
        };

        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(replacement)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.api_endpoints.updateApiEndpoint('674d7b2c8f1e4a1b2c3d4e70', replacement);

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/settings/api-endpoints/674d7b2c8f1e4a1b2c3d4e70/`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(replacement)
          })
        );
        expect(result?.name).toBe('replaced-endpoint');
      });
    });

    describe('deleteApiEndpoint', () => {
      it('should delete an endpoint', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(mockEndpoint)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.api_endpoints.deleteApiEndpoint('674d7b2c8f1e4a1b2c3d4e70');

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/settings/api-endpoints/674d7b2c8f1e4a1b2c3d4e70/`,
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result).toEqual(mockEndpoint);
      });
    });
  });

  describe('Custom URL Operations', () => {
    describe('getByUrl', () => {
      it('should fetch data from custom relative URL', async () => {
        const customData = { id: 1, name: 'test' };
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(customData)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.getByUrl('/custom/endpoint');

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/custom/endpoint`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(customData);
      });

      it('should fetch data from absolute URL', async () => {
        const customData = { id: 2, name: 'absolute' };
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(customData)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.getByUrl('https://external.api.com/data');

        expect(fetch).toHaveBeenCalledWith(
          'https://external.api.com/data',
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(customData);
      });

      it('should include query parameters', async () => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue({})
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        await driver.getByUrl('/custom/endpoint', { q: 'active', pageSize: 10 });

        expect(fetch).toHaveBeenCalledWith(
          `${mockBaseURL}/custom/endpoint?q=active&pageSize=10`,
          expect.any(Object)
        );
      });
    });

    describe('getPaginatedByUrl', () => {
      it('should fetch paginated data without following', async () => {
        const paginatedData = {
          count: 5,
          next: '/api/next',
          previous: null,
          results: [{ id: 1 }, { id: 2 }]
        };
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: jest.fn().mockResolvedValue(paginatedData)
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await driver.getPaginatedByUrl('/api/data', {}, false);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(paginatedData);
      });

      it('should follow pagination when enabled', async () => {
        const page1 = {
          count: 10,
          next: '/api/data?skip=5',
          results: [{ id: 1 }, { id: 2 }]
        };
        const page2 = {
          count: 10,
          next: null,
          results: [{ id: 3 }, { id: 4 }]
        };

        (fetch as jest.Mock)
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(page1)
          })
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(page2)
          });

        const result = await driver.getPaginatedByUrl('/api/data', {}, true);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(result).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw HTTPError with status code', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      try {
        await driver.netbox_integrators.getNetboxIntegrator('test-id');
        fail('Should have thrown HTTPError');
      } catch (error) {
        expect(error).toBeInstanceOf(HTTPError);
        expect((error as HTTPError).code).toBe(500);
        expect((error as HTTPError).message).toBe('500 Internal Server Error');
      }
    });

    it('should throw HTTPError on unauthorized request', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        driver.api_endpoints.getApiEndpoints()
      ).rejects.toThrow(HTTPError);
    });
  });

  describe('Query Parameter Handling', () => {
    it('should handle URLSearchParams correctly', async () => {
      const params = new URLSearchParams({ q: 'active', pageSize: '50' });
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({ count: 0, results: [] })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await driver.netbox_integrators.getNetboxIntegrators(params);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseURL}/vendors/netbox/netbox-integrators/?q=active&pageSize=50`,
        expect.any(Object)
      );
    });

    it('should handle empty parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({ count: 0, results: [] })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await driver.netbox_integrators.getNetboxIntegrators({});

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseURL}/vendors/netbox/netbox-integrators/`,
        expect.any(Object)
      );
    });
  });
});
