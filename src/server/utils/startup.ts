import { config } from '../config/env';
import { validateXmlFiles } from './fileValidation';

/**
 * Performs basic startup validation
 */
export const validateStartup = async (): Promise<void> => {
  console.log('Starting application validation...');

  try {
    // Check environment
    if (!config) {
      throw new Error('Configuration not properly initialized');
    }

    // Validate XML files
    await validateXmlFiles();

    console.log('Validation completed successfully');
  } catch (error) {
    console.error('Startup validation failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}; 