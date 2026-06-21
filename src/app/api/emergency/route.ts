import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// POST /api/emergency - Trigger an SOS emergency alert
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { family_member_id, notes } = body

    if (!family_member_id) {
      return NextResponse.json({ error: 'family_member_id is required' }, { status: 400 })
    }

    // Check for any existing active emergencies for this member
    const { data: existingEmergency } = await supabase
      .from('emergencies')
      .select('id')
      .eq('family_member_id', family_member_id)
      .eq('status', 'active')
      .single()

    if (existingEmergency) {
      return NextResponse.json(
        { error: 'An active emergency already exists for this member', data: existingEmergency },
        { status: 409 }
      )
    }

    const { data: emergency, error } = await supabase
      .from('emergencies')
      .insert({
        family_member_id,
        status: 'active',
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also create a check-in with emergency status
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('checkins').insert({
      family_member_id,
      date: today,
      status: 'emergency',
      notes: notes || 'SOS Emergency triggered',
    })

    return NextResponse.json({ data: emergency }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
