import axios from 'axios';
import { NetboxDriver } from '../src/core/tools/netbox/netbox-driver';
import { AxiosRequestConfig } from 'axios';

describe('NetboxDriver Unit', () => {
  let driver: NetboxDriver;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
    };
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    driver = new NetboxDriver({ baseURL: 'http://mocked' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getPrefix with correct URL and params', async () => {
    const mockResponse = { data: { id: 1, prefix: '10.0.0.0/24' } };
    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);
    const res = await driver.getPrefix(1, { brief: true });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ipam/prefixes/1/', { params: { brief: true } });
    expect(res).toBe(mockResponse);
  });

  it('should call getPrefixes with correct URL and params', async () => {
    const mockResponse = { data: { count: 1, results: [{ id: 1, prefix: '10.0.0.0/24' }] } };
    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);
    const res = await driver.getPrefixes({ status: 'active' });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ipam/prefixes/', { params: { status: 'active' } });
    expect(res).toBe(mockResponse);
  });

  it('should call getNextAvailablePrefix with correct URL and params', async () => {
    const mockResponse = { data: [{ prefix: '10.0.1.0/24' }] };
    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);
    const res = await driver.getNextAvailablePrefix(42, { prefix_length: 24 });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ipam/prefixes/42/available-prefixes/', { params: { prefix_length: 24 } });
    expect(res).toBe(mockResponse);
  });

  it('should call registerNextAvailablePrefix with correct URL and body', async () => {
    const mockResponse = { data: [{ prefix: '10.0.2.0/24' }] };
    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);
    const res = await driver.registerNextAvailablePrefix(42, 24, 100, 'desc', { foo: 'bar' }, { custom: 'field' }, { test: 1 });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/ipam/prefixes/42/available-prefixes/',
      {
        prefix_length: 24,
        vlan: 100,
        description: 'desc',
        foo: 'bar',
        custom_fields: { custom: 'field' },
      },
      { params: { test: 1 } }
    );
    expect(res).toBe(mockResponse);
  });

  it('should call getCustomFields with correct URL and params', async () => {
    const mockResponse = { data: { count: 1, results: [{ id: 1, name: 'cf' }] } };
    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);
    const res = await driver.getCustomFields({ q: 'foo' });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/extras/custom-fields/', { params: { q: 'foo' } });
    expect(res).toBe(mockResponse);
  });
});

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: jest.fn(),
  };
});
