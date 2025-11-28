/**
 * @fileoverview Unit tests for NetboxDriver prefix methods with mocked fetch API.
 * Tests CRUD operations for IP prefixes including retrieval, creation, pagination,
 * and automated prefix allocation with custom fields and choice sets.
 */

import { NetboxDriver } from '../src/core/tools/netbox/netbox-driver';
import { NetboxPrefix } from '../src/types/tools/netbox/ipam/netbox-prefix';
import { NetboxPaginated } from '../src/types/tools/netbox/shared/netbox-paginated';
import { NetboxAvailablePrefix } from '../src/types/tools/netbox/shared/netbox-available-prefix';
import { NetboxParams } from '../src/types/tools/netbox/shared/netbox-params';
import {
  NHN_CommonNetboxExtraChoicesDomain,
  NHN_CommonNetboxExtraChoicesEnvironment,
  NHN_CommonNetboxExtraChoicesInfrastructure,
  NHN_CommonNetboxExtraChoicesPurpose,
} from '../src/types/common/common-nhn-types';

describe('NetboxDriver - Prefix Methods', () => {
  let driver: NetboxDriver;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    // Create and set up mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Initialize NetboxDriver with test configuration
    driver = new NetboxDriver({
      baseURL: 'https://netbox.test.nhn.no/api',
      headers: {
        Authorization: 'Token test-token-12345',
        'Content-Type': 'application/json',
      },
    });
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('getPrefix', () => {
    it('should retrieve a specific prefix by ID', async () => {
      const mockPrefix: NetboxPrefix = {
        id: 42,
        url: 'https://netbox.test.nhn.no/api/ipam/prefixes/42/',
        display: '192.168.100.0/24',
        family: { value: 4, label: 'IPv4' },
        prefix: '192.168.100.0/24',
        status: { value: 'active', label: 'Active' },
        site: { id: 1, name: 'Data Center Oslo', display: 'Data Center Oslo' },
        vrf: { id: 10, name: 'PROD_VRF', display: 'PROD_VRF' },
        tenant: { id: 5, name: 'NHN Operations', display: 'NHN Operations' },
        vlan: { id: 100, name: 'VLAN100', display: 'VLAN100' },
        role: { id: 2, name: 'Production', display: 'Production' },
        is_pool: false,
        mark_utilized: true,
        description: 'Production network for Oslo datacenter',
        comments: 'Primary production subnet',
        tags: [{ id: 1, name: 'production', display: 'production' }],
        custom_fields: {
          domain: NHN_CommonNetboxExtraChoicesDomain['prod.drift.nhn.no'],
          environment: NHN_CommonNetboxExtraChoicesEnvironment.prod,
          infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
          purpose: NHN_CommonNetboxExtraChoicesPurpose.service,
        },
        created: '2025-01-01T00:00:00.000000Z',
        last_updated: '2025-01-15T12:30:00.000000Z',
        children: 2,
        _depth: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.getPrefix(42);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://netbox.test.nhn.no/api/ipam/prefixes/42/',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Token test-token-12345',
          }),
        })
      );
      expect(result).toEqual(mockPrefix);
      expect(result?.prefix).toBe('192.168.100.0/24');
      expect(result?.custom_fields?.domain).toBe('prod.drift.nhn.no');
      expect(result?.custom_fields?.environment).toBe('prod');
    });

    it('should retrieve prefix with query parameters', async () => {
      const mockPrefix: NetboxPrefix = {
        id: 42,
        url: 'https://netbox.test.nhn.no/api/ipam/prefixes/42/',
        display: '192.168.100.0/24',
        prefix: '192.168.100.0/24',
        status: { value: 'active', label: 'Active' },
        is_pool: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const params = { brief: true };
      const result = await driver.prefixes.getPrefix(42, params);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('brief=true'),
        expect.any(Object)
      );
      expect(result).toEqual(mockPrefix);
    });

    it('should throw HTTPError for non-existent prefix', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ detail: 'Not found.' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(driver.prefixes.getPrefix(9999)).rejects.toThrow('Not Found');
    });
  });

  describe('getPrefixes', () => {
    it('should retrieve paginated list of prefixes', async () => {
      const mockResponse: NetboxPaginated<NetboxPrefix> = {
        count: 2,
        results: [
          {
            id: 1,
            url: 'https://netbox.test.nhn.no/api/ipam/prefixes/1/',
            display: '10.0.0.0/8',
            prefix: '10.0.0.0/8',
            status: { value: 'container', label: 'Container' },
            is_pool: false,
            description: 'Private network space',
            custom_fields: {
              domain: NHN_CommonNetboxExtraChoicesDomain['nhn.local'],
              environment: NHN_CommonNetboxExtraChoicesEnvironment.na,
              infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.na,
              purpose: NHN_CommonNetboxExtraChoicesPurpose.datacenter,
            },
          },
          {
            id: 2,
            url: 'https://netbox.test.nhn.no/api/ipam/prefixes/2/',
            display: '192.168.0.0/16',
            prefix: '192.168.0.0/16',
            status: { value: 'active', label: 'Active' },
            is_pool: true,
            description: 'Internal networks',
            custom_fields: {
              domain: NHN_CommonNetboxExtraChoicesDomain['test.drift.nhn.no'],
              environment: NHN_CommonNetboxExtraChoicesEnvironment.test,
              infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.test,
              purpose: NHN_CommonNetboxExtraChoicesPurpose.lab,
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.getPrefixes();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result?.count).toBe(2);
      expect(result?.results).toHaveLength(2);
      expect(result?.results[0].prefix).toBe('10.0.0.0/8');
      expect(result?.results[1].custom_fields?.environment).toBe('test');
    });

    it('should filter prefixes with search parameters', async () => {
      const mockResponse: NetboxPaginated<NetboxPrefix> = {
        count: 1,
        results: [
          {
            id: 42,
            url: 'https://netbox.test.nhn.no/api/ipam/prefixes/42/',
            display: '192.168.100.0/24',
            prefix: '192.168.100.0/24',
            status: { value: 'active', label: 'Active' },
            is_pool: false,
            site: { id: 1, name: 'Data Center Oslo', display: 'Data Center Oslo' },
            custom_fields: {
              domain: NHN_CommonNetboxExtraChoicesDomain['prod.drift.nhn.no'],
              environment: NHN_CommonNetboxExtraChoicesEnvironment.prod,
              infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
              purpose: NHN_CommonNetboxExtraChoicesPurpose.service,
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const params = {
        q: 'production',
        status: 'active',
        family: 4,
        limit: 25,
        ordering: 'prefix',
      };

      const result = await driver.prefixes.getPrefixes(params, false);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=production'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=active'),
        expect.any(Object)
      );
      expect(result?.count).toBe(1);
      expect(result?.results[0].custom_fields?.environment).toBe('prod');
    });

    it('should follow pagination when follow=true', async () => {
      const mockPage1: NetboxPaginated<NetboxPrefix> = {
        count: 3,
        next: 'https://netbox.test.nhn.no/api/ipam/prefixes/?limit=2&offset=2',
        results: [
          {
            id: 1,
            url: 'https://netbox.test.nhn.no/api/ipam/prefixes/1/',
            display: '10.0.0.0/24',
            prefix: '10.0.0.0/24',
            status: { value: 'active', label: 'Active' },
            is_pool: false,
            custom_fields: {
              domain: NHN_CommonNetboxExtraChoicesDomain.na,
              environment: NHN_CommonNetboxExtraChoicesEnvironment.dev,
            },
          },
          {
            id: 2,
            url: 'https://netbox.test.nhn.no/api/ipam/prefixes/2/',
            display: '10.0.1.0/24',
            prefix: '10.0.1.0/24',
            status: { value: 'active', label: 'Active' },
            is_pool: false,
            custom_fields: {
              domain: NHN_CommonNetboxExtraChoicesDomain['qa.drift.nhn.no'],
              environment: NHN_CommonNetboxExtraChoicesEnvironment.qa,
            },
          },
        ],
      };

      const mockPage2: NetboxPaginated<NetboxPrefix> = {
        count: 3,
        results: [
          {
            id: 3,
            url: 'https://netbox.test.nhn.no/api/ipam/prefixes/3/',
            display: '10.0.2.0/24',
            prefix: '10.0.2.0/24',
            status: { value: 'active', label: 'Active' },
            is_pool: false,
            custom_fields: {
              domain: NHN_CommonNetboxExtraChoicesDomain['prod.drift.nhn.no'],
              environment: NHN_CommonNetboxExtraChoicesEnvironment.prod,
            },
          },
        ],
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockPage1,
          headers: new Headers({ 'content-type': 'application/json' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockPage2,
          headers: new Headers({ 'content-type': 'application/json' }),
        });

      const result = await driver.prefixes.getPrefixes({ limit: 2 }, true);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result?.count).toBe(3);
      expect(result?.results).toHaveLength(3);
      expect(result?.results[2].custom_fields?.environment).toBe('prod');
    });
  });

  describe('getNextAvailablePrefix', () => {
    it('should retrieve available prefix suggestions', async () => {
      const mockAvailablePrefixes: NetboxAvailablePrefix[] = [
        {
          family: 4,
          prefix: '192.168.100.0/25',
          vrf: undefined,
        },
        {
          family: 4,
          prefix: '192.168.100.128/25',
          vrf: undefined,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAvailablePrefixes,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.getNextAvailablePrefix(42);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://netbox.test.nhn.no/api/ipam/prefixes/42/available-prefixes/',
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
      expect(result?.[0].prefix).toBe('192.168.100.0/25');
      expect(result?.[1].prefix).toBe('192.168.100.128/25');
    });

    it('should filter available prefixes by prefix length', async () => {
      const mockAvailablePrefixes: NetboxAvailablePrefix[] = [
        {
          family: 4,
          prefix: '192.168.100.0/24',
          vrf: undefined,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAvailablePrefixes,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const params = { prefix_length: 24 };
      const result = await driver.prefixes.getNextAvailablePrefix(42, params);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('prefix_length=24'),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result?.[0].prefix).toBe('192.168.100.0/24');
    });

    it('should throw HTTPError when no available prefixes found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ detail: 'No available prefixes found.' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(driver.prefixes.getNextAvailablePrefix(42)).rejects.toThrow('Bad Request');
    });
  });

  describe('registerNextAvailablePrefix', () => {
    it('should create and allocate a new prefix from available space', async () => {
      const mockCreatedPrefix: NetboxPrefix[] = [
        {
          id: 100,
          url: 'https://netbox.test.nhn.no/api/ipam/prefixes/100/',
          display: '192.168.100.0/25',
          prefix: '192.168.100.0/25',
          status: { value: 'active', label: 'Active' },
          vlan: { id: 100, name: 'VLAN100', display: 'VLAN100' },
          description: 'Production network',
          is_pool: false,
          custom_fields: {
            domain: NHN_CommonNetboxExtraChoicesDomain['prod.drift.nhn.no'],
            environment: NHN_CommonNetboxExtraChoicesEnvironment.prod,
            infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
            purpose: NHN_CommonNetboxExtraChoicesPurpose.service,
          },
          created: '2025-01-20T10:00:00.000000Z',
          last_updated: '2025-01-20T10:00:00.000000Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockCreatedPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.registerNextAvailablePrefix(
        42,
        25,
        100,
        'Production network',
        { status: 'active', role: 5 },
        {
          domain: NHN_CommonNetboxExtraChoicesDomain['prod.drift.nhn.no'],
          environment: NHN_CommonNetboxExtraChoicesEnvironment.prod,
          infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
          purpose: NHN_CommonNetboxExtraChoicesPurpose.service,
        }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://netbox.test.nhn.no/api/ipam/prefixes/42/available-prefixes/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"prefix_length":25'),
        })
      );
      expect(result).toHaveLength(1);
      expect(result?.[0].prefix).toBe('192.168.100.0/25');
      const vlan = result?.[0].vlan;
      if (vlan && typeof vlan === 'object') {
        expect(vlan.id).toBe(100);
      }
      expect(result?.[0].custom_fields?.environment).toBe('prod');
    });

    it('should create prefix with minimal parameters', async () => {
      const mockCreatedPrefix: NetboxPrefix[] = [
        {
          id: 101,
          url: 'https://netbox.test.nhn.no/api/ipam/prefixes/101/',
          display: '192.168.101.0/24',
          prefix: '192.168.101.0/24',
          status: { value: 'active', label: 'Active' },
          is_pool: false,
          created: '2025-01-20T10:15:00.000000Z',
          last_updated: '2025-01-20T10:15:00.000000Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockCreatedPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.registerNextAvailablePrefix(42, 24);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/available-prefixes/'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"prefix_length":24'),
        })
      );
      expect(result?.[0].prefix).toBe('192.168.101.0/24');
    });
  });

  describe('addPrefix', () => {
    it('should create a new prefix with full configuration', async () => {
      const newPrefix: NetboxPrefix = {
        prefix: '172.16.50.0/24',
        status: 'active',
        site: 1,
        vrf: 10,
        tenant: 5,
        vlan: 200,
        role: 3,
        is_pool: false,
        mark_utilized: true,
        description: 'Development subnet for Oslo',
        comments: 'Primary development network',
        tags: [{ id: 2, name: 'development', display: 'development' }],
        custom_fields: {
          domain: NHN_CommonNetboxExtraChoicesDomain['test.drift.nhn.no'],
          environment: NHN_CommonNetboxExtraChoicesEnvironment.dev,
          infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.test,
          purpose: NHN_CommonNetboxExtraChoicesPurpose.devops,
        },
      };

      const mockCreatedPrefix: NetboxPrefix = {
        id: 200,
        url: 'https://netbox.test.nhn.no/api/ipam/prefixes/200/',
        display: '172.16.50.0/24',
        family: { value: 4, label: 'IPv4' },
        ...newPrefix,
        created: '2025-01-20T11:00:00.000000Z',
        last_updated: '2025-01-20T11:00:00.000000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockCreatedPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.addPrefix(newPrefix);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://netbox.test.nhn.no/api/ipam/prefixes/',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"prefix":"172.16.50.0/24"'),
        })
      );
      expect(result?.id).toBe(200);
      expect(result?.prefix).toBe('172.16.50.0/24');
      expect(result?.custom_fields?.domain).toBe('test.drift.nhn.no');
      expect(result?.custom_fields?.environment).toBe('dev');
    });

    it('should create an IPv6 prefix', async () => {
      const newPrefix: NetboxPrefix = {
        prefix: '2001:db8::/64',
        status: 'active',
        description: 'IPv6 management network',
        custom_fields: {
          domain: NHN_CommonNetboxExtraChoicesDomain['mgmt.ld.nhn.no'],
          environment: NHN_CommonNetboxExtraChoicesEnvironment.mgmt,
          infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.mgmt,
          purpose: NHN_CommonNetboxExtraChoicesPurpose.mgmt,
        },
      };

      const mockCreatedPrefix: NetboxPrefix = {
        id: 201,
        url: 'https://netbox.test.nhn.no/api/ipam/prefixes/201/',
        display: '2001:db8::/64',
        family: { value: 6, label: 'IPv6' },
        ...newPrefix,
        is_pool: false,
        created: '2025-01-20T11:30:00.000000Z',
        last_updated: '2025-01-20T11:30:00.000000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockCreatedPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.addPrefix(newPrefix);

      expect(result?.prefix).toBe('2001:db8::/64');
      expect(result?.family?.value).toBe(6);
      expect(result?.custom_fields?.purpose).toBe('mgmt');
    });

    it('should update existing prefix when ID provided', async () => {
      const updatePrefix: NetboxPrefix = {
        prefix: '192.168.100.0/24',
        status: 'deprecated',
        description: 'Deprecated network - migrate to new range',
        custom_fields: {
          domain: NHN_CommonNetboxExtraChoicesDomain['prod.drift.nhn.no'],
          environment: NHN_CommonNetboxExtraChoicesEnvironment.prod,
          infrastructure: NHN_CommonNetboxExtraChoicesInfrastructure.prod,
          purpose: NHN_CommonNetboxExtraChoicesPurpose.archive,
        },
      };

      const mockUpdatedPrefix: NetboxPrefix = {
        id: 42,
        url: 'https://netbox.test.nhn.no/api/ipam/prefixes/42/',
        display: '192.168.100.0/24',
        family: { value: 4, label: 'IPv4' },
        ...updatePrefix,
        is_pool: false,
        created: '2025-01-01T00:00:00.000000Z',
        last_updated: '2025-01-20T12:00:00.000000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUpdatedPrefix,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await driver.prefixes.updatePrefix(updatePrefix, 42);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://netbox.test.nhn.no/api/ipam/prefixes/42/',
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result?.status).toBe('deprecated');
      expect(result?.custom_fields?.purpose).toBe('archive');
    });

    it('should throw HTTPError on creation failure', async () => {
      const newPrefix: NetboxPrefix = {
        prefix: 'invalid-prefix',
        status: 'active',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ prefix: ['Enter a valid IPv4 or IPv6 prefix.'] }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(driver.prefixes.addPrefix(newPrefix)).rejects.toThrow('Bad Request');
    });
  });
});
