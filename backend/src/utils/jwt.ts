import jwt from "jsonwebtoken";
const EXPIRES = "7d";
export const signJwt = (payload: object, secret: string) =>
  jwt.sign(payload, secret, { expiresIn: EXPIRES });
export const verifyJwt = <T>(token: string, secret: string): T =>
  jwt.verify(token, secret) as T;
