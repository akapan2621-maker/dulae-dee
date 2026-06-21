import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

type RouteParams = { familyId: string }

// GET /api/appointments/[familyId] - Get all appointments for a family
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { familyId } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get family members first
    const { data: members, error: membersError } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', familyId)

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

    const memberIds = (members as Array<{id: string}>)?.map(m => m.id) || []

    if (memberIds.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    // Get all appointments for family members
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*, family_members!inner(name, role)')
      .in('family_member_id', memberIds)
      .order('appointment_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: appointments }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
