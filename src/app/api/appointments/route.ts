import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET /api/appointments - List appointments (optionally filtered by family_member_id)
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
      .from('appointments')
      .select('*, family_members!inner(family_id, name)')
      .order('appointment_date', { ascending: true })

    if (familyMemberId) {
      query = query.eq('family_member_id', familyMemberId)
    }

    const { data: appointments, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: appointments }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      family_member_id,
      hospital,
      department,
      doctor_name,
      appointment_date,
      reminder_days_before,
      notes,
    } = body

    if (!family_member_id) {
      return NextResponse.json({ error: 'family_member_id is required' }, { status: 400 })
    }
    if (!hospital || typeof hospital !== 'string') {
      return NextResponse.json({ error: 'Hospital name is required' }, { status: 400 })
    }
    if (!appointment_date) {
      return NextResponse.json({ error: 'appointment_date is required' }, { status: 400 })
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        family_member_id,
        hospital: hospital.trim(),
        department: department || null,
        doctor_name: doctor_name || null,
        appointment_date,
        reminder_days_before: reminder_days_before ?? 1,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: appointment }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
