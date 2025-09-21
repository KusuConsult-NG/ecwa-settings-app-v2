import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock income data
    const incomeRecords = [
      {
        id: '1',
        source: 'Sunday Offering',
        amount: 150000,
        date: '2024-01-15',
        description: 'Weekly Sunday service offering',
        category: 'Offering',
        status: 'confirmed',
        recordedBy: 'Pastor John',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        source: 'Tithe',
        amount: 75000,
        date: '2024-01-14',
        description: 'Monthly tithe collection',
        category: 'Tithe',
        status: 'confirmed',
        recordedBy: 'Pastor Jane',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14'
      },
      {
        id: '3',
        source: 'Special Offering',
        amount: 200000,
        date: '2024-01-12',
        description: 'Building fund offering',
        category: 'Special',
        status: 'pending',
        recordedBy: 'Pastor Mike',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12'
      }
    ]

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
    const { source, amount, date, description, category } = body

    // Mock income creation
    const newIncome = {
      id: Date.now().toString(),
      source,
      amount: parseFloat(amount),
      date,
      description,
      category,
      status: 'pending',
      recordedBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newIncome,
      message: 'Income record created successfully'
    })
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
