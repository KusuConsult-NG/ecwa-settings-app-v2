import { NextRequest, NextResponse } from 'next/server'
import { getAllIncome, createIncome } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const incomeRecords = getAllIncome()

    return NextResponse.json({
      success: true,
      data: incomeRecords
    })
  } catch (error) {
    console.error('Income API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, amount, date, recordedBy, bankTransactionId, giver, narration, bankRef } = body

    // Support both old and new format
    if (bankTransactionId) {
      // New format with bank transaction
      if (!source || !amount || !giver || !narration) {
        return NextResponse.json({
          success: false,
          message: 'Source, amount, giver, and narration are required'
        }, { status: 400 })
      }

      const newIncome = createIncome({
        source: `${source} - ${giver}`,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        recordedBy: recordedBy || 'Current User',
        status: 'completed'
      })

      return NextResponse.json({
        success: true,
        data: newIncome,
        message: 'Income record created successfully from bank transaction'
      })
    } else {
      // Old format
      if (!source || !amount || !date || !recordedBy) {
        return NextResponse.json({
          success: false,
          message: 'Source, amount, date, and recordedBy are required'
        }, { status: 400 })
      }

      const newIncome = createIncome({
        source,
        amount: parseFloat(amount),
        date,
        recordedBy,
        status: 'completed'
      })

      return NextResponse.json({
        success: true,
        data: newIncome,
        message: 'Income record created successfully'
      })
    }
  } catch (error) {
    console.error('Income creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
