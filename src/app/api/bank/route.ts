import { NextRequest, NextResponse } from 'next/server'
import { getAllBankAccounts, createBankAccount } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const banks = getAllBankAccounts()

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
    const { name, accountNumber, balance, currency } = body

    if (!name || !accountNumber || balance === undefined || !currency) {
      return NextResponse.json({
        success: false,
        message: 'Name, accountNumber, balance, and currency are required'
      }, { status: 400 })
    }

    const newBank = createBankAccount({
      name,
      accountNumber,
      balance: parseFloat(balance),
      currency,
      status: 'active'
    })

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
