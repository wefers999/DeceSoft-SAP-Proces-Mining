import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';
import { config } from '../config/env';

// Mock the config
jest.mock('../config/env', () => ({
  config: {
    xmlFilesPath: path.join(__dirname, '../../../data'),
    isDevelopment: true,
    port: 3000
  }
}));

// Create a large test XML file
const TEST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  ${Array(1000).fill('<test>Hello World</test>').join('\n  ')}
</root>`;

describe('Server API Tests', () => {
  let app: express.Application;
  
  beforeAll(async () => {
    // Create test XML file
    const testFilePath = path.join(config.xmlFilesPath, '1_Response20230320_Cases.XML');
    await fs.writeFile(testFilePath, TEST_XML);
    
    // Import the app after setting up mocks
    const { default: createApp } = await import('../index');
    app = createApp();
  });

  afterAll(async () => {
    // Cleanup test files
    try {
      await fs.unlink(path.join(config.xmlFilesPath, '1_Response20230320_Cases.XML'));
    } catch (error) {
      console.error('Error cleaning up test files:', error);
    }
  });

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('environment', 'development');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/data/:type', () => {
    it('should return XML data for valid type', async () => {
      const response = await request(app).get('/api/data/cases');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('root');
      expect(response.body.root.test[0]).toBe('Hello World');
    });

    it('should return 400 for invalid type', async () => {
      const response = await request(app).get('/api/data/invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
      }
    });

    it('should block requests exceeding rate limit', async () => {
      // Make many requests quickly
      const requests = Array(150).fill(null).map(() => 
        request(app).get('/api/health')
      );
      
      const responses = await Promise.all(requests);
      
      // At least one request should be rate limited
      expect(responses.some(r => r.status === 429)).toBe(true);
    });
  });

  describe('Compression', () => {
    it('should return compressed response for large data', async () => {
      const response = await request(app)
        .get('/api/data/cases')
        .set('Accept-Encoding', 'gzip');
      
      expect(response.headers['content-encoding']).toBe('gzip');
      expect(response.status).toBe(200);
    });
  });
}); 