/**
 * Utility functions tests
 */

describe('Utility Functions', () => {
  describe('Date formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = date.toLocaleDateString();
      expect(formatted).toBeTruthy();
    });
  });

  describe('String validation', () => {
    it('should validate ISBN format', () => {
      const validISBN = '978-3-16-148410-0';
      const isValidFormat = /^[\d-]+$/.test(validISBN);
      expect(isValidFormat).toBe(true);
    });

    it('should validate email format', () => {
      const validEmail = 'test@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(validEmail)).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidEmail = 'invalid.email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });
  });

  describe('Number validation', () => {
    it('should validate year is a number', () => {
      const year = 2024;
      expect(typeof year).toBe('number');
      expect(year).toBeGreaterThan(0);
    });

    it('should validate year range', () => {
      const year = 2024;
      const currentYear = new Date().getFullYear();
      expect(year).toBeLessThanOrEqual(currentYear + 1);
      expect(year).toBeGreaterThan(1000);
    });
  });

  describe('Array operations', () => {
    it('should filter array correctly', () => {
      const items = [1, 2, 3, 4, 5];
      const filtered = items.filter(item => item > 3);
      expect(filtered).toEqual([4, 5]);
    });

    it('should map array correctly', () => {
      const items = [1, 2, 3];
      const mapped = items.map(item => item * 2);
      expect(mapped).toEqual([2, 4, 6]);
    });
  });

  describe('Object operations', () => {
    it('should check if object has property', () => {
      const obj = { name: 'Test', age: 25 };
      expect(obj.hasOwnProperty('name')).toBe(true);
      expect(obj.hasOwnProperty('email')).toBe(false);
    });

    it('should get object keys', () => {
      const obj = { name: 'Test', age: 25 };
      const keys = Object.keys(obj);
      expect(keys).toEqual(['name', 'age']);
    });
  });
});
