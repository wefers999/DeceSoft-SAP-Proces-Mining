import { z } from 'zod';
import path from 'path';

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const env = envSchema.parse(process.env);

export const config = {
    port: parseInt(env.PORT, 10),
    isDevelopment: env.NODE_ENV === 'development',
    xmlFilesPath: path.join(process.cwd(), 'data')
}; 