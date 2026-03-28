-- Add country column to events table for global event support
ALTER TABLE events ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'DK';
CREATE INDEX IF NOT EXISTS idx_events_country ON events(country);

-- Update existing events to have 'DK' as country
UPDATE events SET country = 'DK' WHERE country IS NULL;
