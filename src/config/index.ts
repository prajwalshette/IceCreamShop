import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
	PORT,
	SECRET_KEY,
} = process.env;
