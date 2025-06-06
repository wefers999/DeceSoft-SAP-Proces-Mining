import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';
import { config } from './config/env';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// XML file paths
const XML_FILES = {
  cases: path.join(config.xmlFilesPath, '1_Response20230320_Cases.XML'),
  events: path.join(config.xmlFilesPath, '2_Response20230320_Cases_Events.XML'),
  messages: path.join(config.xmlFilesPath, '3_Response20230320_Cases_Messages.XML'),
  docDetails: path.join(config.xmlFilesPath, '4_Response20230320_Cases_DocDetails.XML')
};

export default function createApp() {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.static('public'));

  // Add compression for large responses
  app.use(compression({
    level: 6,
    threshold: 0 // Always compress responses
  }));

  // Add request logging
  app.use(morgan('tiny'));

  // Add rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api/', limiter);

  // XML Parser setup
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true
  });

  // API endpoint to read XML files
  app.get('/api/data/:type', async (req: express.Request, res: express.Response): Promise<void> => {
    const startTime = Date.now();
    try {
      const type = req.params.type as keyof typeof XML_FILES;
      if (!XML_FILES[type]) {
        res.status(400).json({ error: 'Invalid file type' });
        return;
      }

      const xmlContent = await fs.readFile(XML_FILES[type], 'utf-8');
      const data = parser.parse(xmlContent);

      // Special handling for document details
      if (type === 'docDetails') {
        // Just return the complete XML data without transformation
        res.json(data.Response);
      } else {
        res.json(data);
      }

      // Log successful request
      console.log(`Processed ${type} request in ${Date.now() - startTime}ms`);
    } catch (error) {
      // Log error with details
      console.error('Error processing request:', {
        type: req.params.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });

      res.status(500).json({ 
        error: 'Error reading XML file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Basic health check
  app.get('/api/health', (_req: express.Request, res: express.Response) => {
    res.json({ 
      status: 'healthy',
      environment: config.isDevelopment ? 'development' : 'production',
      uptime: process.uptime()
    });
  });

  return app;
}

// Only start the server if this file is run directly
if (require.main === module) {
  // Start server with proper shutdown handling
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.isDevelopment ? 'development' : 'production'} mode`);
  });

  // Graceful shutdown handler
  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 5000);
  };

  // Handle shutdown signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Handle uncaught errors
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    shutdown();
  });

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
    shutdown();
  });
} 