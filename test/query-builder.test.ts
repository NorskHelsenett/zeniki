/**
 * @fileoverview Unit tests for query-builder utilities
 * Tests both queryBuilder (async) and queryBuilderSync (sync) functions
 * with various input types including objects and URLSearchParams
 */

import { queryBuilder, queryBuilderSync } from '../src/core/utils/query-builder';

describe('queryBuilder (async)', () => {
  describe('with object input', () => {
    it('should build query string from simple object', async () => {
      const params = {
        limit: '50',
        offset: '0',
        search: 'example'
      };
      const result = await queryBuilder(params);
      expect(result).toBe('?limit=50&offset=0&search=example');
    });

    it('should handle numeric values', async () => {
      const params = {
        page: '1',
        size: '25'
      };
      const result = await queryBuilder(params);
      expect(result).toBe('?page=1&size=25');
    });

    it('should encode special characters', async () => {
      const params = {
        search: 'example with spaces',
        description: 'DMZ & firewall'
      };
      const result = await queryBuilder(params);
      expect(result).toContain('search=example+with+spaces');
      expect(result).toContain('description=DMZ+%26+firewall');
    });

    it('should handle empty object', async () => {
      const params = {};
      const result = await queryBuilder(params);
      expect(result).toBe('');
    });

    it('should handle NetBox-style filters', async () => {
      const params = {
        status: 'active',
        family: '4',
        site_id: '1'
      };
      const result = await queryBuilder(params);
      expect(result).toBe('?status=active&family=4&site_id=1');
    });

    it('should handle complex NetBox filters', async () => {
      const params = {
        description__icontains: 'network',
        created__gte: '2025-01-01'
      };
      const result = await queryBuilder(params);
      expect(result).toContain('description__icontains=network');
      expect(result).toContain('created__gte=2025-01-01');
    });

    it('should handle URL-encoded values', async () => {
      const params = {
        within_include: '10.0.0.0/8'
      };
      const result = await queryBuilder(params);
      expect(result).toBe('?within_include=10.0.0.0%2F8');
    });
  });

  describe('with URLSearchParams input', () => {
    it('should build query string from URLSearchParams', async () => {
      const urlParams = new URLSearchParams({
        page: '1',
        limit: '100'
      });
      const result = await queryBuilder(urlParams);
      expect(result).toBe('?page=1&limit=100');
    });

    it('should handle empty URLSearchParams', async () => {
      const urlParams = new URLSearchParams();
      const result = await queryBuilder(urlParams);
      expect(result).toBe('');
    });

    it('should handle URLSearchParams with special characters', async () => {
      const urlParams = new URLSearchParams({
        search: 'test value',
        filter: 'a&b'
      });
      const result = await queryBuilder(urlParams);
      expect(result).toContain('search=test+value');
      expect(result).toContain('filter=a%26b');
    });

    it('should handle URLSearchParams with multiple values', async () => {
      const urlParams = new URLSearchParams();
      urlParams.append('tag', 'network');
      urlParams.append('tag', 'production');
      const result = await queryBuilder(urlParams);
      expect(result).toContain('tag=network');
      expect(result).toContain('tag=production');
    });
  });

  describe('edge cases', () => {
    it('should handle null input', async () => {
      const result = await queryBuilder(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', async () => {
      const result = await queryBuilder(undefined as any);
      expect(result).toBe('');
    });

    it('should handle single parameter', async () => {
      const params = { id: '123' };
      const result = await queryBuilder(params);
      expect(result).toBe('?id=123');
    });
  });
});

describe('queryBuilderSync (sync)', () => {
  describe('with object input', () => {
    it('should build query string from simple object', () => {
      const params = {
        limit: '50',
        offset: '0',
        search: 'example'
      };
      const result = queryBuilderSync(params);
      expect(result).toBe('?limit=50&offset=0&search=example');
    });

    it('should handle numeric values', () => {
      const params = {
        page: '1',
        size: '25'
      };
      const result = queryBuilderSync(params);
      expect(result).toBe('?page=1&size=25');
    });

    it('should encode special characters', () => {
      const params = {
        search: 'example with spaces',
        description: 'DMZ & firewall'
      };
      const result = queryBuilderSync(params);
      expect(result).toContain('search=example+with+spaces');
      expect(result).toContain('description=DMZ+%26+firewall');
    });

    it('should handle empty object', () => {
      const params = {};
      const result = queryBuilderSync(params);
      expect(result).toBe('');
    });

    it('should handle NetBox-style filters', () => {
      const params = {
        status: 'active',
        family: '4',
        site_id: '1'
      };
      const result = queryBuilderSync(params);
      expect(result).toBe('?status=active&family=4&site_id=1');
    });

    it('should handle complex NetBox filters', () => {
      const params = {
        description__icontains: 'network',
        created__gte: '2025-01-01'
      };
      const result = queryBuilderSync(params);
      expect(result).toContain('description__icontains=network');
      expect(result).toContain('created__gte=2025-01-01');
    });

    it('should handle URL-encoded values', () => {
      const params = {
        within_include: '10.0.0.0/8'
      };
      const result = queryBuilderSync(params);
      expect(result).toBe('?within_include=10.0.0.0%2F8');
    });
  });

  describe('with URLSearchParams input', () => {
    it('should build query string from URLSearchParams', () => {
      const urlParams = new URLSearchParams({
        page: '1',
        limit: '100'
      });
      const result = queryBuilderSync(urlParams);
      expect(result).toBe('?page=1&limit=100');
    });

    it('should handle empty URLSearchParams', () => {
      const urlParams = new URLSearchParams();
      const result = queryBuilderSync(urlParams);
      expect(result).toBe('');
    });

    it('should handle URLSearchParams with special characters', () => {
      const urlParams = new URLSearchParams({
        search: 'test value',
        filter: 'a&b'
      });
      const result = queryBuilderSync(urlParams);
      expect(result).toContain('search=test+value');
      expect(result).toContain('filter=a%26b');
    });

    it('should handle URLSearchParams with multiple values', () => {
      const urlParams = new URLSearchParams();
      urlParams.append('tag', 'network');
      urlParams.append('tag', 'production');
      const result = queryBuilderSync(urlParams);
      expect(result).toContain('tag=network');
      expect(result).toContain('tag=production');
    });

    it('should handle URLSearchParams with vlan_id', () => {
      const urlParams = new URLSearchParams({ vlan_id: '100' });
      const result = queryBuilderSync(urlParams);
      expect(result).toBe('?vlan_id=100');
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      const result = queryBuilderSync(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = queryBuilderSync(undefined as any);
      expect(result).toBe('');
    });

    it('should handle single parameter', () => {
      const params = { id: '123' };
      const result = queryBuilderSync(params);
      expect(result).toBe('?id=123');
    });
  });
});

describe('queryBuilder vs queryBuilderSync', () => {
  it('should produce identical results for the same input object', async () => {
    const params = {
      status: 'active',
      limit: '50',
      offset: '0'
    };
    const asyncResult = await queryBuilder(params);
    const syncResult = queryBuilderSync(params);
    expect(asyncResult).toBe(syncResult);
  });

  it('should produce identical results for the same URLSearchParams', async () => {
    const urlParams = new URLSearchParams({
      page: '1',
      size: '25'
    });
    const asyncResult = await queryBuilder(urlParams);
    const syncResult = queryBuilderSync(urlParams);
    expect(asyncResult).toBe(syncResult);
  });

  it('should both handle empty inputs identically', async () => {
    const asyncResult = await queryBuilder({});
    const syncResult = queryBuilderSync({});
    expect(asyncResult).toBe(syncResult);
    expect(asyncResult).toBe('');
  });
});
