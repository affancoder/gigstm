import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = async (request: NextRequest) => {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    await supabase.auth.getSession()
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}
