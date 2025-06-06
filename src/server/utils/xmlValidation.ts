import { XMLParser } from 'fast-xml-parser';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Basic XML structure validation
export function validateXMLStructure(xmlContent: string): ValidationResult {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
      validateXML: true
    });

    parser.parse(xmlContent);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid XML structure'
    };
  }
}

// Validate expected root elements based on file type
export function validateXMLContent(data: any, type: string): ValidationResult {
  try {
    switch (type) {
      case 'cases':
        if (!data.Response?.Cases) {
          return { isValid: false, error: 'Missing Cases data' };
        }
        break;
      case 'events':
        if (!data.Response?.Events) {
          return { isValid: false, error: 'Missing Events data' };
        }
        break;
      case 'messages':
        if (!data.Response?.Messages) {
          return { isValid: false, error: 'Missing Messages data' };
        }
        break;
      case 'docDetails':
        if (!data.Response?.Documents) {
          return { isValid: false, error: 'Missing Document details' };
        }
        break;
      default:
        return { isValid: false, error: 'Unknown file type' };
    }
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid content structure'
    };
  }
} 