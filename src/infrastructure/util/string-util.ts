export function encodeBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64')
}

export function decodeBase64(base64String: string) {
  return Buffer.from(base64String, 'base64').toString('utf8')
}
