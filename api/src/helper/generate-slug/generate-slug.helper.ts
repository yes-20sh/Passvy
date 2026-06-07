import { randomBytes } from 'crypto';

export const generateSlugHelper = (title: string): string => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const uniqueId = randomBytes(3).toString('hex');
  return `${baseSlug}-${uniqueId}`;
};
