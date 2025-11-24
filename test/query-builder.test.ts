/**
 * @fileoverview Unit tests for query builder utilities.
 * Tests both synchronous and asynchronous query string building functions.
 */

import { queryBuilder, queryBuilderSync } from '../src/core/utils/query-builder';

describe('Query Builder Utilities', () => {
  describe('queryBuilderSync', () => {
    it('should build a simple query string from an object', () => {
      const params = {
        status: 'active',
        family: 4,
        limit: 50
      };

      const result = queryBuilderSync(params);
      
      expect(result).toBe('?status=active&family=4&limit=50');
    });

    it('should handle URL encoding of special characters', () => {
      const params = {
        description: 'Test & Development',
        prefix: '192.168.1.0/24',
        tags: 'production,staging'
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('description=Test+%26+Development'); // URLSearchParams uses + for spaces
      expect(result).toContain('prefix=192.168.1.0%2F24');
      expect(result).toContain('tags=production%2Cstaging');
    });

    it('should handle boolean values', () => {
      const params = {
        is_pool: true,
        mark_utilized: false,
        brief: true
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('is_pool=true');
      expect(result).toContain('mark_utilized=false');
      expect(result).toContain('brief=true');
    });

    it('should handle numeric values', () => {
      const params = {
        id: 123,
        limit: 100,
        offset: 50,
        prefix_length: 24
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('id=123');
      expect(result).toContain('limit=100');
      expect(result).toContain('offset=50');
      expect(result).toContain('prefix_length=24');
    });

    it('should handle null and undefined values by converting them to strings', () => {
      const params = {
        status: 'active',
        vlan: null,
        site: undefined,
        description: 'test'
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('status=active');
      expect(result).toContain('description=test');
      expect(result).toContain('vlan=null'); // URLSearchParams converts null to string
      expect(result).toContain('site=undefined'); // URLSearchParams converts undefined to string
    });

    it('should handle empty objects', () => {
      const result = queryBuilderSync({});
      expect(result).toBe('?'); // URLSearchParams produces ? even for empty objects
    });

    it('should handle arrays by converting them to comma-separated strings', () => {
      const params = {
        tags: ['production', 'critical'],
        status: ['active', 'reserved'],
        site_id: [1, 2, 3]
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('tags=production%2Ccritical');
      expect(result).toContain('status=active%2Creserved');
      expect(result).toContain('site_id=1%2C2%2C3');
    });

    it('should handle complex nested objects by converting to string', () => {
      const params = {
        filter: {
          status: 'active',
          family: 4
        },
        ordering: 'prefix'
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('ordering=prefix');
      expect(result).toContain('filter=');
    });

    it('should handle mixed parameter types', () => {
      const params = {
        q: 'search term',
        limit: 25,
        active: true,
        tags: ['prod', 'web'],
        vlan: null,
        offset: 0
      };

      const result = queryBuilderSync(params);
      
      expect(result).toContain('q=search+term'); // URLSearchParams uses + for spaces
      expect(result).toContain('limit=25');
      expect(result).toContain('active=true');
      expect(result).toContain('tags=prod%2Cweb');
      expect(result).toContain('offset=0');
      expect(result).toContain('vlan=null'); // null becomes string
    });
  });

  describe('queryBuilder (async)', () => {
    it('should build a simple query string from an object asynchronously', async () => {
      const params = {
        status: 'active',
        family: 4,
        limit: 50
      };

      const result = await queryBuilder(params);
      
      expect(result).toBe('?status=active&family=4&limit=50');
    });

    it('should handle URL encoding of special characters asynchronously', async () => {
      const params = {
        description: 'Test & Development',
        prefix: '192.168.1.0/24',
        tags: 'production,staging'
      };

      const result = await queryBuilder(params);
      
      expect(result).toContain('description=Test+%26+Development'); // URLSearchParams uses + for spaces
      expect(result).toContain('prefix=192.168.1.0%2F24');
      expect(result).toContain('tags=production%2Cstaging');
    });

    it('should handle complex NetBox query parameters', async () => {
      const params = {
        within_include: '10.0.0.0/8',
        status: 'active',
        role: 'user-networks',
        family: 4,
        is_pool: false,
        limit: 100,
        ordering: 'prefix'
      };

      const result = await queryBuilder(params);
      
      expect(result).toContain('within_include=10.0.0.0%2F8');
      expect(result).toContain('status=active');
      expect(result).toContain('role=user-networks');
      expect(result).toContain('family=4');
      expect(result).toContain('is_pool=false');
      expect(result).toContain('limit=100');
      expect(result).toContain('ordering=prefix');
    });

    it('should handle custom field filters', async () => {
      const params = {
        cf_environment: 'production',
        cf_business_unit: 'engineering',
        'cf_cost_center': '1234',
        limit: 50
      };

      const result = await queryBuilder(params);
      
      expect(result).toContain('cf_environment=production');
      expect(result).toContain('cf_business_unit=engineering');
      expect(result).toContain('cf_cost_center=1234');
      expect(result).toContain('limit=50');
    });

    it('should handle empty objects asynchronously', async () => {
      const result = await queryBuilder({});
      expect(result).toBe('?'); // URLSearchParams produces ? even for empty objects
    });

    it('should produce the same result as sync version', async () => {
      const params = {
        status: 'active',
        family: 4,
        limit: 50,
        tags: ['prod', 'critical'],
        is_pool: true,
        description: 'Network & Infrastructure'
      };

      const asyncResult = await queryBuilder(params);
      const syncResult = queryBuilderSync(params);
      
      expect(asyncResult).toBe(syncResult);
    });
  });

  describe('Real-world NetBox scenarios', () => {
    it('should build query for prefix search within a supernet', async () => {
      const params = {
        within_include: '192.168.0.0/16',
        status: 'active',
        family: 4,
        limit: 100,
        ordering: 'prefix'
      };

      const result = await queryBuilder(params);
      
      expect(result).toContain('within_include=192.168.0.0%2F16');
      expect(result).toContain('status=active');
      expect(result).toContain('family=4');
      expect(result).toContain('limit=100');
      expect(result).toContain('ordering=prefix');
    });

    it('should build query for custom field filtering', async () => {
      const params = {
        cf_environment: 'production',
        cf_business_unit: 'platform',
        status: ['active', 'reserved'],
        limit: 200
      };

      const result = await queryBuilder(params);
      
      expect(result).toContain('cf_environment=production');
      expect(result).toContain('cf_business_unit=platform');
      expect(result).toContain('status=active%2Creserved');
      expect(result).toContain('limit=200');
    });

    it('should build query for text search with pagination', async () => {
      const params = {
        q: 'management network',
        limit: 25,
        offset: 50,
        ordering: '-created'
      };

      const result = await queryBuilder(params);
      
      expect(result).toContain('q=management+network'); // URLSearchParams uses + for spaces
      expect(result).toContain('limit=25');
      expect(result).toContain('offset=50');
      expect(result).toContain('ordering=-created');
    });
  });
});
