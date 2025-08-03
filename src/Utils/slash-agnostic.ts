export function removeSlashAfter(target: string): string {
  if (!target?.length) return '';
  return target[target.length - 1].includes('/') ? target.slice(0, -1) : target;
}

export function addSlashBefore(target: string): string {
  if (!target?.length) return '/';
  return target[0].includes('/') ? target : `/${target}`;
}

export function slashAgnostic(leftPart: string, rightPart: string): string {
  return `${removeSlashAfter(leftPart)}${addSlashBefore(rightPart)}`;
}
