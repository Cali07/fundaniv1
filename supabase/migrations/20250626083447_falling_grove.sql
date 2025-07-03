/*
  # Create flashcard system

  1. New Tables
    - `flashcard_sets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `name` (text)
      - `category` (text)
      - `art_style` (text)
      - `custom_words` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `flashcards`
      - `id` (uuid, primary key)
      - `set_id` (uuid, references flashcard_sets)
      - `front` (text)
      - `back` (text)
      - `image_url` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their flashcard sets
*/

-- Create flashcard_sets table
CREATE TABLE IF NOT EXISTS flashcard_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  art_style text NOT NULL,
  custom_words text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id uuid REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  image_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies for flashcard_sets
CREATE POLICY "Users can read own flashcard sets"
  ON flashcard_sets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard sets"
  ON flashcard_sets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard sets"
  ON flashcard_sets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcard sets"
  ON flashcard_sets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for flashcards
CREATE POLICY "Users can read flashcards from own sets"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs 
      WHERE fs.id = flashcards.set_id 
      AND fs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert flashcards to own sets"
  ON flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs 
      WHERE fs.id = flashcards.set_id 
      AND fs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update flashcards in own sets"
  ON flashcards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs 
      WHERE fs.id = flashcards.set_id 
      AND fs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete flashcards from own sets"
  ON flashcards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs 
      WHERE fs.id = flashcards.set_id 
      AND fs.user_id = auth.uid()
    )
  );

-- Trigger for updated_at on flashcard_sets
CREATE TRIGGER update_flashcard_sets_updated_at
  BEFORE UPDATE ON flashcard_sets
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();