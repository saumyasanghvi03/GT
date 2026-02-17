import crypto from 'crypto';

export const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
