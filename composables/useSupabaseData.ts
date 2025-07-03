import { createClient } from '@supabase/supabase-js'

export const useSupabaseData = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  // User Profile Operations
  const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  const createUserProfile = async (userId: string, displayName: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        display_name: displayName,
        total_xp: 0,
        level: 1
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const updateUserProfile = async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Quest Operations
  const getQuests = async () => {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const getUserQuestProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_quest_progress')
      .select(`
        *,
        quests (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  }

  const updateQuestProgress = async (userId: string, questId: string, progress: number) => {
    const { data, error } = await supabase
      .from('user_quest_progress')
      .upsert({
        user_id: userId,
        quest_id: questId,
        progress,
        completed: progress >= 100,
        completed_at: progress >= 100 ? new Date().toISOString() : null
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Badge Operations
  const getBadges = async () => {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const getUserBadges = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  }

  const earnBadge = async (userId: string, badgeId: string) => {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId
      })
      .select()
      .single()
    
    if (error && error.code !== '23505') throw error // Ignore duplicate key errors
    return data
  }

  // Avatar Operations
  const getAvatarItems = async () => {
    const { data, error } = await supabase
      .from('avatar_items')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const getUserAvatarItems = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_avatar_items')
      .select(`
        *,
        avatar_items (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  }

  const updateAvatarItem = async (userId: string, itemId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_avatar_items')
      .update(updates)
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const equipAvatarItem = async (userId: string, itemId: string, category: string) => {
    // First, unequip all items in the same category
    await supabase
      .from('user_avatar_items')
      .update({ equipped: false })
      .eq('user_id', userId)
      .in('item_id', 
        supabase
          .from('avatar_items')
          .select('id')
          .eq('category', category)
      )

    // Then equip the selected item
    const { data, error } = await supabase
      .from('user_avatar_items')
      .update({ equipped: true })
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Flashcard Operations
  const getFlashcardSets = async (userId: string) => {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .select(`
        *,
        flashcards (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  const createFlashcardSet = async (userId: string, setData: any) => {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .insert({
        user_id: userId,
        ...setData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const createFlashcards = async (setId: string, cards: any[]) => {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(
        cards.map((card, index) => ({
          set_id: setId,
          front: card.front,
          back: card.back,
          image_url: card.image,
          order_index: index
        }))
      )
      .select()
    
    if (error) throw error
    return data
  }

  const deleteFlashcardSet = async (setId: string) => {
    const { error } = await supabase
      .from('flashcard_sets')
      .delete()
      .eq('id', setId)
    
    if (error) throw error
  }

  return {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    getQuests,
    getUserQuestProgress,
    updateQuestProgress,
    getBadges,
    getUserBadges,
    earnBadge,
    getAvatarItems,
    getUserAvatarItems,
    updateAvatarItem,
    equipAvatarItem,
    getFlashcardSets,
    createFlashcardSet,
    createFlashcards,
    deleteFlashcardSet
  }
}