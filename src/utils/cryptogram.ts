import * as crypto from 'crypto';

/**
 * 生成指定长度（例如128位或256位）的随机盐
 * @param length
 * @returns
 */
export const makeSalt = (length = 256) => {
  // 指定盐应为字节形式，因此这里将长度转换为字节数
  const byteLength = length / 8; // 通常盐的长度以位表示，但需要转换成字节（每8位为1字节）

  return crypto.randomBytes(byteLength).toString('hex');
};

/**
 * Encrypt password
 * @param password 密码
 * @param salt 密码盐
 */
export const encryptPassword = (password: string, salt: string): string => {
  if (!password || !salt) return '';
  return crypto.pbkdf2Sync(password, salt, 30623, 64, 'sha512').toString('hex');
};
