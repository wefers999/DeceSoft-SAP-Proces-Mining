import { z } from 'zod';

// Base schemas for common attributes
const baseEntitySchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  version: z.string().optional(),
});

// Case-related schemas
export const caseSchema = baseEntitySchema.extend({
  caseId: z.string(),
  documentGroups: z.array(z.object({
    entityType: z.string(),
    sequenceNumber: z.string(),
    eventCount: z.number(),
  })),
});

// Event-related schemas
export const eventSchema = baseEntitySchema.extend({
  caseId: z.string(),
  eventType: z.string(),
  level: z.enum(['HEADER', 'ITEM']),
  userId: z.string(),
  timestamp: z.string().datetime(),
  details: z.record(z.string()).optional(),
});

// Message-related schemas
export const messageSchema = baseEntitySchema.extend({
  caseId: z.string(),
  messageType: z.string(),
  severity: z.enum(['INFO', 'WARNING', 'ERROR']),
  content: z.string(),
  timestamp: z.string().datetime(),
});

// Document details schema
export const documentDetailsSchema = baseEntitySchema.extend({
  caseId: z.string(),
  fieldDefinitions: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string().optional(),
  })),
  tableMappings: z.array(z.object({
    tableName: z.string(),
    fields: z.array(z.string()),
  })),
});

// Export TypeScript types derived from Zod schemas
export type Case = z.infer<typeof caseSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Message = z.infer<typeof messageSchema>;
export type DocumentDetails = z.infer<typeof documentDetailsSchema>;

// Validation functions
export const validateCase = (data: unknown): Case => {
  return caseSchema.parse(data);
};

export const validateEvent = (data: unknown): Event => {
  return eventSchema.parse(data);
};

export const validateMessage = (data: unknown): Message => {
  return messageSchema.parse(data);
};

export const validateDocumentDetails = (data: unknown): DocumentDetails => {
  return documentDetailsSchema.parse(data);
}; 