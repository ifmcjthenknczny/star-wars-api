// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDuplicateKeyError(error: any): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error?.driverError?.code === '23505';
}
