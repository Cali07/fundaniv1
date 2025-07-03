/*
  # Create avatar customization system

  1. New Tables
    - `avatar_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text) - hair, outfit, accessory, background
      - `image` (text) - emoji or image URL
      - `xp_required` (integer)
      - `created_at` (timestamp)
    
    - `user_avatar_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `item_id` (uuid, references avatar_items)
      - `unlocked` (boolean)
      - `equipped` (boolean)
      - `unlocked_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their avatar items
*/

-- Create avatar_items table
CREATE TABLE IF NOT EXISTS avatar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('hair', 'outfit', 'accessory', 'background')),
  image text NOT NULL,
  xp_required integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_avatar_items table
CREATE TABLE IF NOT EXISTS user_avatar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  item_id uuid REFERENCES avatar_items(id) ON DELETE CASCADE,
  unlocked boolean DEFAULT false,
  equipped boolean DEFAULT false,
  unlocked_at timestamptz,
  UNIQUE(user_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_items ENABLE ROW LEVEL SECURITY;

-- Create policies for avatar_items (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read avatar items"
  ON avatar_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_avatar_items
CREATE POLICY "Users can read own avatar items"
  ON user_avatar_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own avatar items"
  ON user_avatar_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar items"
  ON user_avatar_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default avatar items
INSERT INTO avatar_items (name, category, image, xp_required) VALUES
  -- Hair options
  ('Brown Hair', 'hair', '👦', 0),
  ('Blonde Hair', 'hair', '👱', 50),
  ('Curly Hair', 'hair', '👨‍🦱', 100),
  ('Red Hair', 'hair', '👩‍🦰', 150),
  
  -- Outfits
  ('Casual Wear', 'outfit', '👕', 0),
  ('Superhero Costume', 'outfit', '🦸', 150),
  ('Wizard Robes', 'outfit', '🧙', 200),
  ('Pirate Outfit', 'outfit', '🏴‍☠️', 250),
  
  -- Accessories
  ('Cool Sunglasses', 'accessory', '🕶️', 75),
  ('Magic Hat', 'accessory', '🎩', 125),
  ('Crown', 'accessory', '👑', 300),
  ('Headphones', 'accessory', '🎧', 100),
  
  -- Backgrounds
  ('Forest', 'background', '🌲', 0),
  ('Space', 'background', '🌌', 100),
  ('Castle', 'background', '🏰', 175),
  ('Beach', 'background', '🏖️', 125),
  ('City', 'background', '🏙️', 200);

-- Function to initialize user avatar items when profile is created
CREATE OR REPLACE FUNCTION public.initialize_user_avatar_items()
RETURNS trigger AS $$
BEGIN
  -- Insert all avatar items for the new user, with default items unlocked and equipped
  INSERT INTO public.user_avatar_items (user_id, item_id, unlocked, equipped, unlocked_at)
  SELECT 
    NEW.id,
    ai.id,
    CASE WHEN ai.xp_required = 0 THEN true ELSE false END,
    CASE 
      WHEN ai.name = 'Brown Hair' THEN true
      WHEN ai.name = 'Casual Wear' THEN true
      WHEN ai.name = 'Forest' THEN true
      ELSE false
    END,
    CASE WHEN ai.xp_required = 0 THEN now() ELSE null END
  FROM avatar_items ai;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize avatar items when user profile is created
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.initialize_user_avatar_items();