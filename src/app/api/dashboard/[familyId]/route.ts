import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

type RouteParams = { familyId: string }

// GET /api/dashboard/[familyId] - Get family dashboard summary
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

    // Get family info
    const { data: family, error: familyError } = await supabase.schema('dulae_dee')
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single()

    if (familyError || !family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 })
    }

    // Get all members with their role
    const { data: members, error: membersError } = await supabase.schema('dulae_dee')
      .from('family_members')
      .select('*')
      .eq('family_id', familyId)

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

    const memberIds = (members as Array<{id: string}>)?.map(m => m.id) || []

    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    // Get today's check-ins
    const { data: todayCheckins } = await supabase.schema('dulae_dee')
      .from('checkins')
      .select('*')
      .in('family_member_id', memberIds)
      .eq('date', today)

    // Get active medications count
    const { data: activeMedications } = await supabase.schema('dulae_dee')
      .from('medications')
      .select('id, family_member_id, name, times')
      .in('family_member_id', memberIds)
      .eq('is_active', true)

    // Get pending medication logs for today
    const { data: pendingMedLogs } = await supabase.schema('dulae_dee')
      .from('medication_logs')
      .select('*')
      .in('family_member_id', memberIds)
      .eq('status', 'pending')

    // Get active emergencies
    const { data: activeEmergencies } = await supabase.schema('dulae_dee')
      .from('emergencies')
      .select('*')
      .in('family_member_id', memberIds)
      .eq('status', 'active')

    // Get upcoming appointments (within next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const { data: upcomingAppointments } = await supabase.schema('dulae_dee')
      .from('appointments')
      .select('*')
      .in('family_member_id', memberIds)
      .gte('appointment_date', new Date().toISOString())
      .lte('appointment_date', nextWeek.toISOString())
      .order('appointment_date', { ascending: true })

    return NextResponse.json({
      data: {
        family,
        members: members || [],
        summary: {
          totalMembers: members?.length || 0,
          elderlyCount: members?.filter(m => m.role === 'elderly').length || 0,
          todayCheckins: todayCheckins || [],
          checkinsCompleted: todayCheckins?.length || 0,
          activeMedications: activeMedications || [],
          pendingMedicationDoses: pendingMedLogs?.length || 0,
          activeEmergencies: activeEmergencies || [],
          hasActiveEmergency: (activeEmergencies?.length || 0) > 0,
          upcomingAppointments: upcomingAppointments || [],
        },
      },
    }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
