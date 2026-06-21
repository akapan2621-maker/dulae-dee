import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

type RouteParams = { id: string }

// POST /api/medications/[id]/confirm - Confirm a medication dose was taken
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

    // Verify the medication exists
    const { data: medication, error: medError } = await supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .single()

    if (medError || !medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const { scheduled_time } = body

    // Find or create the medication log entry for this scheduled time
    let scheduledTime = scheduled_time || new Date().toISOString()

    // Try to find existing pending log for this medication at this time
    const { data: existingLog } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('medication_id', id)
      .eq('status', 'pending')
      .eq('scheduled_time', scheduledTime)
      .single()

    if (existingLog) {
      // Update existing pending log to confirmed
      const { data: updatedLog, error: updateError } = await supabase
        .from('medication_logs')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', existingLog.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ data: updatedLog }, { status: 200 })
    }

    // Create a new confirmed log entry
    const { data: newLog, error: insertError } = await supabase
      .from('medication_logs')
      .insert({
        medication_id: id,
        family_member_id: medication.family_member_id,
        scheduled_time: scheduledTime,
        confirmed_at: new Date().toISOString(),
        status: 'confirmed',
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ data: newLog }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
