export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          about: string | null
          created_at: string
          updated_at: string
        }
        // Add other tables as needed...
      }
    }
  }
}
