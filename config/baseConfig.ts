import { config as dotenvConfig} from 'dotenv';
import { join } from 'path';

dotenvConfig({ path:join(process.cwd(), '.env') });

export const BASE_URL: string = process.env.BASE_URL ?? 'https://practicesoftwaretesting.com'
export const USER_NAME: string = process.env.BASE_URL ?? 'Jane Doe'
export const USER_EMAIL: string = process.env.BASE_URL ?? 'customer@practicesoftwaretesting.com'
export const USER_PASSWORD: string = process.env.BASE_URL!

