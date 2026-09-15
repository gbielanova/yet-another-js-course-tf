function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
    }
    return value;
}

export const customer = {
    name: requireEnv('USER_NAME'),
    email: requireEnv('USER_EMAIL'),
    password: requireEnv('USER_PASSWORD'),
};
