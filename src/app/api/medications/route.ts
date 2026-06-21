import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET /api/medications - List medications (optionally filtered by family_member_id)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const familyMemberId = searchParams.get('family_member_id')

    let query = supabase
      .from('medications')
      .select('*, family_members!inner(family_id)')
      .order('created_at', { ascending: false })

    if (familyMemberId) {
      query = query.eq('family_member_id', familyMemberId)
    }

    const { data: medications, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: medications }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/medications - Add a new medication
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { family_member_id, name, dosage, times, before_after_food, notes } = body

    if (!family_member_id) {
      return NextResponse.json({ error: 'family_member_id is required' }, { status: 400 })
    }
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Medication name is required' }, { status: 400 })
    }
    if (!dosage || typeof dosage !== 'string') {
      return NextResponse.json({ error: 'Dosage is required' }, { status: 400 })
    }
    if (!times || !Array.isArray(times)) {
      return NextResponse.json({ error: 'Times must be an array' }, { status: 400 })
    }

    const { data: medication, error } = await supabase
      .from('medications')
      .insert({
        family_member_id,
        name: name.trim(),
        dosage: dosage.trim(),
        times,
        before_after_food: before_after_food || null,
        notes: notes || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: medication }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
