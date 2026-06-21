import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET /api/checkin - Get check-ins (optionally filtered by family_member_id)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const familyMemberId = searchParams.get('family_member_id')
    const date = searchParams.get('date')

    let query = supabase
      .from('checkins')
      .select('*, family_members!inner(family_id, name)')
      .order('created_at', { ascending: false })

    if (familyMemberId) {
      query = query.eq('family_member_id', familyMemberId)
    }
    if (date) {
      query = query.eq('date', date)
    }

    const { data: checkins, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: checkins }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/checkin - Create a daily check-in
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { family_member_id, status, symptoms, notes } = body

    if (!family_member_id) {
      return NextResponse.json({ error: 'family_member_id is required' }, { status: 400 })
    }
    if (!status || !['good', 'not_good', 'emergency'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be good, not_good, or emergency' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().split('T')[0]

    // Check if a check-in already exists for today
    const { data: existingCheckin } = await supabase
      .from('checkins')
      .select('id')
      .eq('family_member_id', family_member_id)
      .eq('date', today)
      .single()

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'A check-in already exists for today. Update it instead.' },
        { status: 409 }
      )
    }

    const { data: checkin, error } = await supabase
      .from('checkins')
      .insert({
        family_member_id,
        date: today,
        status,
        symptoms: symptoms || [],
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If emergency status, create an emergency record too
    if (status === 'emergency') {
      await supabase.from('emergencies').insert({
        family_member_id,
        status: 'active',
      })
    }

    return NextResponse.json({ data: checkin }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
