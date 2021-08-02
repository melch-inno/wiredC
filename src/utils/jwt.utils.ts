import jwt from "jsonwebtoken";
import config from "config";

// interface Decoded {
//   valid: boolean;
//   expired: boolean | string;
//   decoded: string | null;
// }

const privateKey: string = config.get("privateKey");

export function sign(
  object: Object,
  options?: jwt.SignOptions | undefined
): string {
  return jwt.sign(object, privateKey, options);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decode(token: string): any {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: "jwt expired",
      decoded: null,
    };
  }
}
