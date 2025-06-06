import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { config } from '../config/env';

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

const XML_FILE_NAMES = [
  '1_Response20230320_Cases.XML',
  '2_Response20230320_Cases_Events.XML',
  '3_Response20230320_Cases_Messages.XML',
  '4_Response20230320_Cases_DocDetails.XML',
] as const;

export type XmlFileName = typeof XML_FILE_NAMES[number];

// XML Parser for validation
const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  validateXML: true
});

/**
 * Simple utility to validate XML files existence and basic structure
 */
export const validateXmlFiles = async (): Promise<void> => {
  try {
    // Check if directory exists and is readable
    try {
      await fs.access(config.xmlFilesPath, fs.constants.R_OK);
    } catch (error) {
      throw new FileValidationError(`XML files directory not accessible: ${config.xmlFilesPath}`);
    }
    
    // Validate each required XML file
    for (const fileName of XML_FILE_NAMES) {
      const filePath = path.join(config.xmlFilesPath, fileName);
      try {
        // Check file existence and readability
        await fs.access(filePath, fs.constants.R_OK);
        
        // Basic file size check
        const stats = await fs.stat(filePath);
        if (stats.size === 0) {
          throw new FileValidationError(`XML file is empty: ${fileName}`);
        }
        if (stats.size > 100 * 1024 * 1024) { // 100MB limit
          throw new FileValidationError(`XML file too large: ${fileName}`);
        }

        // Check XML structure
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          parser.parse(content);
        } catch (parseError) {
          throw new FileValidationError(`Invalid XML structure in file ${fileName}: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } catch (error) {
        if (error instanceof FileValidationError) {
          throw error;
        }
        throw new FileValidationError(`Cannot access XML file: ${fileName}`);
      }
    }

    console.log('All XML files validated successfully');
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    throw new FileValidationError('Failed to validate XML files');
  }
};

/**
 * Get the full path for a XML file
 */
export const getXmlFilePath = (fileName: XmlFileName): string => {
  return path.join(config.xmlFilesPath, fileName);
}; 