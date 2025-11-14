/*
  # Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - Sender's name
      - `email` (text) - Sender's email
      - `subject` (text) - Message subject
      - `message` (text) - Message content
      - `status` (text) - Message status (new, read, replied)
      - `created_at` (timestamptz) - Submission timestamp

  2. Security
    - Enable RLS on contact_messages table
    - Allow public insert (anyone can submit contact form)
    - Restrict read access (only authenticated admins in future)

  3. Important Notes
    - Store all contact form submissions
    - Track status for follow-up management
    - Preserve message history
*/

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view messages (for admin panel in future)
CREATE POLICY "Authenticated users can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);