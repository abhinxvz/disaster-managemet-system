/*
  # Create centers table for disaster response platform

  1. New Tables
    - `centers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - either 'health' or 'shelter'
      - `status` (text) - either 'open' or 'closed'
      - `contact` (text)
      - `capacity` (integer)
      - `occupancy` (integer)
      - `lat` (double precision)
      - `lng` (double precision)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `centers` table
    - Add policies for:
      - Public read access
      - Authenticated users can create/update centers
*/

CREATE TABLE centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('health', 'shelter')),
  status text NOT NULL CHECK (status IN ('open', 'closed')),
  contact text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  occupancy integer NOT NULL CHECK (occupancy >= 0),
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT occupancy_check CHECK (occupancy <= capacity)
);

-- Enable row level security
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Centers are viewable by everyone"
  ON centers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create centers"
  ON centers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update centers"
  ON centers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_centers_updated_at
  BEFORE UPDATE ON centers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();