import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'h4h_super_secret_jwt_key_2024_dna_hackathon';

export function signToken(payload: object, expiresIn = '24h'): string {
  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): jwt.JwtPayload | string {
  return jwt.verify(token, SECRET);
}
