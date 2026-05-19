import { pgTable, serial, text, timestamp, integer, varchar } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('기타').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  author: varchar('author', { length: 100 }).notNull().default('Bong Dev'),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guestbook = pgTable('guestbook', {
  id: serial('id').primaryKey(),
  author: varchar('author', { length: 100 }).notNull().default('익명'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
