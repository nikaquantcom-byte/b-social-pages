-- Migration: 20260328_010_events_unique_constraint.sql
-- Description: Add unique constraint to events table for deduplication
-- This prevents the "ON CONFLICT specification" error in import-events function
-- and ensures event deduplication works correctly at DB level.

ALTER TABLE events 
ADD CONSTRAINT events_title_date_country_unique 
UNIQUE (title, date, country);
