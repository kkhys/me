import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { posts } from './schema/post';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Example seed data
const seed = async () => {
  await db.insert(posts).values([
    {
      slug: 'hello-world',
      views: 100,
    },
  ]);
};

const main = async () => {
  try {
    await seed();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

void main();
