import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock bank data
    const banks = [
      {
        id: '1',
        name: 'First Bank of Nigeria',
        accountNumber: '1234567890',
        accountName: 'ECWA Jos DCC',
        balance: 1500000,
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Access Bank',
        accountNumber: '0987654321',
        accountName: 'ECWA Jos DCC',
        balance: 750000,
        status: 'active',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      }
    ]

    return NextResponse.json({
      success: true,
      data: banks
    })
  } catch (error) {
    console.error('Bank API error:', error)
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
    const { name, accountNumber, accountName, balance } = body

    // Mock bank creation
    const newBank = {
      id: Date.now().toString(),
      name,
      accountNumber,
      accountName,
      balance: balance || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newBank,
      message: 'Bank account created successfully'
    })
  } catch (error) {
    console.error('Bank creation error:', error)
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
