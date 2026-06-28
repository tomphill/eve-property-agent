import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  slackUserId: text("slack_user_id"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  postcode: text("postcode").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  propertyType: text("property_type").notNull(),
  description: text("description"),
  status: text("status").notNull().default("available"),
  listingAgentId: integer("listing_agent_id")
    .notNull()
    .references(() => agents.id),
  soldByAgentId: integer("sold_by_agent_id").references(() => agents.id),
  soldPrice: integer("sold_price"),
  listedAt: timestamp("listed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  soldAt: timestamp("sold_at", { withTimezone: true }),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact"),
  assignedAgentId: integer("assigned_agent_id")
    .notNull()
    .references(() => agents.id),
  maxPrice: integer("max_price"),
  minBedrooms: integer("min_bedrooms"),
  preferredPostcodes: text("preferred_postcodes").array(),
  propertyType: text("property_type"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const viewings = pgTable("viewings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agents.id),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
