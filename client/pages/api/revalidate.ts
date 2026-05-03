import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * On-Demand Revalidation — appelé par l'API serveur après publication/mise à jour
 * POST /api/revalidate
 * Body: { secret: string, slug?: string, type?: 'list' | 'review' }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret, slug, type } = req.body;

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  try {
    const paths: string[] = ['/'];

    if (slug) paths.push(`/article/${slug}`);
    if (type === 'list') paths.push('/listes');
    if (type === 'review') paths.push('/critiques');

    await Promise.all(paths.map((path) => res.revalidate(path)));

    console.log(`[revalidate] Paths rebuilt: ${paths.join(', ')}`);
    return res.json({ revalidated: true, paths });
  } catch (err: any) {
    console.error('[revalidate] Error:', err.message);
    return res.status(500).json({ message: 'Error revalidating', error: err.message });
  }
}
