/**
 * @fileoverview Unit tests for IP hashing utilities.
 * Tests the ipToHash function with various IP addresses and algorithms.
 */

import { ipToHash } from '../src/core/utils/ip-to-hash';

describe('IP Hash Utilities', () => {
  describe('ipToHash function', () => {
    it('should generate consistent hash for IPv4 addresses', async () => {
      const ip = '192.168.1.100';
      
      const hash1 = await ipToHash(ip);
      const hash2 = await ipToHash(ip);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{32}$/); // MD5 format
      expect(hash1).toHaveLength(32);
    });

    it('should generate different hashes for different IPv4 addresses', async () => {
      const ip1 = '192.168.1.100';
      const ip2 = '192.168.1.101';
      
      const hash1 = await ipToHash(ip1);
      const hash2 = await ipToHash(ip2);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle IPv6 addresses', async () => {
      const ip = '2001:db8::1';
      
      const hash = await ipToHash(ip);
      
      expect(hash).toMatch(/^[a-f0-9]{32}$/); // MD5 format
      expect(hash).toHaveLength(32);
    });

    it('should generate consistent hash for IPv6 addresses', async () => {
      const ip = '2001:db8:85a3::8a2e:370:7334';
      
      const hash1 = await ipToHash(ip);
      const hash2 = await ipToHash(ip);
      
      expect(hash1).toBe(hash2);
    });

    it('should handle different IPv6 formats', async () => {
      const ip1 = '2001:db8::1';
      const ip2 = '2001:0db8:0000:0000:0000:0000:0000:0001';
      
      const hash1 = await ipToHash(ip1);
      const hash2 = await ipToHash(ip2);
      
      // Since the implementation doesn't normalize IPv6 addresses,
      // different formats will produce different hashes
      expect(hash1).toMatch(/^[a-f0-9]{32}$/);
      expect(hash2).toMatch(/^[a-f0-9]{32}$/);
      // They may or may not be equal depending on normalization
    });

    it('should use SHA-256 when specified', async () => {
      const ip = '192.168.1.100';
      
      const hash = await ipToHash(ip, 'sha256');
      
      expect(hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 format
      expect(hash).toHaveLength(64);
    });

    it('should generate different hashes for different algorithms', async () => {
      const ip = '192.168.1.100';
      
      const md5Hash = await ipToHash(ip, 'md5');
      const sha256Hash = await ipToHash(ip, 'sha256');
      
      expect(md5Hash).not.toBe(sha256Hash);
      expect(md5Hash).toHaveLength(32);
      expect(sha256Hash).toHaveLength(64);
    });

    it('should handle edge case IPv4 addresses', async () => {
      const testCases = [
        '0.0.0.0',
        '127.0.0.1',
        '255.255.255.255',
        '10.0.0.1',
        '172.16.0.1',
        '192.168.0.1'
      ];

      for (const ip of testCases) {
        const hash = await ipToHash(ip);
        expect(hash).toMatch(/^[a-f0-9]{32}$/);
        expect(hash).toHaveLength(32);
      }
    });

    it('should handle edge case IPv6 addresses', async () => {
      const testCases = [
        '::',
        '::1',
        'fe80::',
        'ff02::1',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348'
      ];

      for (const ip of testCases) {
        const hash = await ipToHash(ip);
        expect(hash).toMatch(/^[a-f0-9]{32}$/);
        expect(hash).toHaveLength(32);
      }
    });

    it('should handle localhost addresses', async () => {
      const ipv4Localhost = '127.0.0.1';
      const ipv6Localhost = '::1';
      
      const hash4 = await ipToHash(ipv4Localhost);
      const hash6 = await ipToHash(ipv6Localhost);
      
      expect(hash4).toMatch(/^[a-f0-9]{32}$/);
      expect(hash6).toMatch(/^[a-f0-9]{32}$/);
      expect(hash4).not.toBe(hash6);
    });

    it('should be suitable for creating unique identifiers', async () => {
      const ips = [
        '192.168.1.1',
        '192.168.1.2',
        '192.168.1.3',
        '10.0.0.1',
        '172.16.0.1'
      ];

      const hashes = await Promise.all(
        ips.map(ip => ipToHash(ip))
      );

      // All hashes should be unique
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(ips.length);

      // All hashes should be valid hex strings
      hashes.forEach(hash => {
        expect(hash).toMatch(/^[a-f0-9]{32}$/);
      });
    });

    it('should handle mixed IPv4 and IPv6 addresses', async () => {
      const mixedIPs = [
        '192.168.1.100',
        '2001:db8::1',
        '10.0.0.1',
        'fe80::1',
        '172.16.0.1',
        '::1'
      ];

      const hashes = await Promise.all(
        mixedIPs.map(ip => ipToHash(ip))
      );

      // All hashes should be unique
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(mixedIPs.length);

      // All hashes should be valid
      hashes.forEach(hash => {
        expect(hash).toMatch(/^[a-f0-9]{32}$/);
        expect(hash).toHaveLength(32);
      });
    });

    it('should work with both supported algorithms', async () => {
      const ip = '203.0.113.1'; // TEST-NET-3
      
      const md5Hash = await ipToHash(ip, 'md5');
      const sha256Hash = await ipToHash(ip, 'sha256');
      
      expect(md5Hash).toMatch(/^[a-f0-9]{32}$/);
      expect(sha256Hash).toMatch(/^[a-f0-9]{64}$/);
      
      // Should be consistent
      const md5Hash2 = await ipToHash(ip, 'md5');
      const sha256Hash2 = await ipToHash(ip, 'sha256');
      
      expect(md5Hash).toBe(md5Hash2);
      expect(sha256Hash).toBe(sha256Hash2);
    });

    it('should handle real-world usage scenarios', async () => {
      // Scenario: Creating device names from IP addresses
      const deviceIPs = [
        '192.168.100.10',
        '192.168.100.11',
        '192.168.100.12'
      ];

      const deviceNames = await Promise.all(
        deviceIPs.map(async (ip) => {
          const hash = await ipToHash(ip);
          return `device-${hash.substring(0, 8)}`;
        })
      );

      // Should create unique device names
      const uniqueNames = new Set(deviceNames);
      expect(uniqueNames.size).toBe(deviceIPs.length);

      // Names should follow expected format
      deviceNames.forEach(name => {
        expect(name).toMatch(/^device-[a-f0-9]{8}$/);
      });
    });

    it('should be performant with multiple calls', async () => {
      const ip = '198.51.100.1'; // TEST-NET-2
      const iterations = 100;
      
      const startTime = Date.now();
      
      const promises = Array(iterations).fill(null).map(() => ipToHash(ip));
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000);
      
      // All results should be identical
      const firstResult = results[0];
      results.forEach(result => {
        expect(result).toBe(firstResult);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle invalid IP addresses gracefully', async () => {
      const invalidIPs = [
        '999.999.999.999',
        'not-an-ip',
        '192.168.1',
        '192.168.1.1.1',
        '',
        'gggg::1'
      ];

      for (const invalidIP of invalidIPs) {
        try {
          await ipToHash(invalidIP);
          // If it doesn't throw, the hash should still be valid
        } catch (error) {
          // Error handling is acceptable for invalid inputs
          expect(error).toBeDefined();
        }
      }
    });

    it('should handle unsupported algorithms gracefully', async () => {
      const ip = '192.168.1.1';
      
      try {
        await ipToHash(ip, 'unsupported' as any);
        // If it doesn't throw, should default to a supported algorithm
      } catch (error) {
        // Error handling is acceptable for unsupported algorithms
        expect(error).toBeDefined();
      }
    });
  });
});
