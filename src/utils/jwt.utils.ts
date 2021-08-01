import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get("privateKey") as string;

export function sign(
  object: Object,
  options?: jwt.SignOptions | undefined
): string {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string): any {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded } as Object;
  } catch (error) {
    return {
      valid: false,
      expired: "jwt expired",
      decoded: null,
    };
  }
}
