export function renderByAuth(
  stringOrObject: string | { authorized: string; unauthorized: string },
  authorized?: boolean,
): string {
  return typeof stringOrObject === 'string'
    ? stringOrObject
    : stringOrObject[authorized ? 'authorized' : 'unauthorized'];
}
