import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

type RouteParams = { familyId: string }

// GET /api/reports/[familyId]/weekly - Get weekly health report for a family
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { familyId } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate the date range for the past 7 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Get family members
    const { data: members, error: membersError } = await supabase
      .from('family_members')
      .select('*')
      .eq('family_id', familyId)

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

    const memberIds = members?.map(m => m.id) || []
    if (memberIds.length === 0) {
      return NextResponse.json({ data: { members: [], report: { checkins: [], medicationAdherence: [], emergencies: [] } } }, { status: 200 })
    }

    // Get check-ins for the past week
    const { data: checkins } = await supabase
      .from('checkins')
      .select('*')
      .in('family_member_id', memberIds)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .order('date', { ascending: true })

    // Get medication logs for the past week
    const { data: medicationLogs } = await supabase
      .from('medication_logs')
      .select('*, medications!inner(name, family_member_id)')
      .in('family_member_id', memberIds)
      .gte('scheduled_time', startDate.toISOString())
      .lte('scheduled_time', endDate.toISOString())

    // Calculate medication adherence
    const totalDoses = medicationLogs?.length || 0
    const confirmedDoses = medicationLogs?.filter(log => log.status === 'confirmed').length || 0
    const missedDoses = medicationLogs?.filter(log => log.status === 'missed').length || 0
    const skippedDoses = medicationLogs?.filter(log => log.status === 'skipped').length || 0

    // Get emergencies for the past week
    const { data: emergencies } = await supabase
      .from('emergencies')
      .select('*')
      .in('family_member_id', memberIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    // Build per-member summaries
    const memberSummaries = members?.map(member => {
      const memberCheckins = checkins?.filter(c => c.family_member_id === member.id) || []
      const memberLogs = medicationLogs?.filter(l => l.medications?.family_member_id === member.id) || []
      const memberConfirmed = memberLogs.filter(l => l.status === 'confirmed').length

      return {
        memberId: member.id,
        name: member.name,
        role: member.role,
        checkinsCount: memberCheckins.length,
        checkinStatuses: memberCheckins.map(c => c.status),
        symptoms: memberCheckins.flatMap(c => c.symptoms || []),
        medicationDoses: memberLogs.length,
        medicationConfirmed: memberConfirmed,
        adherenceRate: memberLogs.length > 0
          ? Math.round((memberConfirmed / memberLogs.length) * 100)
          : 0,
      }
    }) || []

    return NextResponse.json({
      data: {
        period: { from: startDateStr, to: endDateStr },
        members: memberSummaries,
        report: {
          totalCheckins: checkins?.length || 0,
          checkinBreakdown: {
            good: checkins?.filter(c => c.status === 'good').length || 0,
            not_good: checkins?.filter(c => c.status === 'not_good').length || 0,
            emergency: checkins?.filter(c => c.status === 'emergency').length || 0,
          },
          medicationAdherence: {
            totalDoses,
            confirmed: confirmedDoses,
            missed: missedDoses,
            skipped: skippedDoses,
            adherenceRate: totalDoses > 0 ? Math.round((confirmedDoses / totalDoses) * 100) : 0,
          },
          emergencies: emergencies || [],
          emergencyCount: emergencies?.length || 0,
        },
      },
    }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
