import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.refresh()
  }

  return {
    user,
    signInWithGoogle,
    signOut
  }
}
