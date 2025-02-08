/*
  # Add email subscribers table

  1. New Tables
    - `email_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `verified` (boolean)
      - `last_notified` (timestamp)
  2. Security
    - Enable RLS on `email_subscribers` table
    - Add policy for public to insert their email
    - Add policy for authenticated users to read subscriber data
*/

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  last_notified timestamptz,
  CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable row level security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to subscribe"
  ON email_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read subscribers"
  ON email_subscribers
  FOR SELECT
  TO authenticated
  USING (true);