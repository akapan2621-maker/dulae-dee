import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

type RouteParams = { id: string }

// GET /api/families/[id]/members - Get all members of a family
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: members, error } = await supabase.schema('dulae_dee')
      .from('family_members')
      .select('*')
      .eq('family_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: members }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/families/[id]/members - Add a new member to a family
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, age, phone, line_user_id, telegram_id } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 })
    }
    if (!role || !['elderly', 'family', 'caregiver'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be elderly, family, or caregiver' },
        { status: 400 }
      )
    }

    const { data: member, error } = await supabase.schema('dulae_dee')
      .from('family_members')
      .insert({
        family_id: id,
        name: name.trim(),
        role,
        age: age || null,
        phone: phone || null,
        line_user_id: line_user_id || null,
        telegram_id: telegram_id || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: member }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
