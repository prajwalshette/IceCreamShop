import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
	PORT,
	SECRET_KEY,
    LOG_DIR,
	BASE_PATH,
	ORIGIN,
	LOG_FORMAT,
	NODE_ENV
} = process.env;
