import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

const parser = new Parser();
const ITEMS_PER_PAGE = 9;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page = '1' } = req.query;
  const pageNumber = parseInt(page as string, 10);

  try {
    const feed = await parser.parseURL('https://scrapbook.hackclub.com/YeGao.rss');
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const posts = feed.items.slice(startIndex, endIndex).map((item) => ({
      id: item.guid || item.link,
      title: item.title || 'Untitled',
      description: item.contentSnippet || 'No description',
      image: item.enclosure?.url || './public/Placeholder.jpg',
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
}