import { index, pgSchema, pgTable, smallint, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const neonAuth = pgSchema('neon_auth');

const authUser = neonAuth.table('user', {
  id: uuid('id').primaryKey(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerUserId: uuid('customer_user_id').references(() => authUser.id, { onDelete: 'set null' }),
  customerName: varchar('customer_name', { length: 80 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 40 }).notNull(),
  customerEmail: varchar('customer_email', { length: 254 }),
  startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true, mode: 'date' }).notNull(),
  partySize: smallint('party_size').notNull(),
  location: varchar('location', { length: 120 }),
  notes: text('notes').notNull().default(''),
  status: varchar('status', { length: 16 }).notNull().default('confirmed'),
  source: varchar('source', { length: 16 }).notNull().default('website'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('bookings_start_time_idx').on(table.startTime),
  index('bookings_customer_user_start_idx').on(table.customerUserId, table.startTime),
]);

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 80 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  topic: varchar('topic', { length: 80 }).notNull(),
  message: varchar('message', { length: 500 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('contact_messages_created_at_idx').on(table.createdAt),
]);

export type Booking = typeof bookings.$inferSelect;
