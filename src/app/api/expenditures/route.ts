import { NextRequest, NextResponse } from 'next/server'
import { getAllExpenditures, createExpenditure } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const expenditures = getAllExpenditures()
    return NextResponse.json({ success: true, data: expenditures })
  } catch (error: any) {
    console.error('Error fetching expenditures:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch expenditures', error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, amount, category, createdBy } = await request.json()
    if (!title || !amount || !category || !createdBy) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const newExpenditure = createExpenditure({
      title,
      description: description || '',
      amount,
      category,
      status: 'pending',
      createdBy
    })
    
    return NextResponse.json({ success: true, data: newExpenditure }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating expenditure:', error)
    return NextResponse.json({ success: false, message: 'Failed to create expenditure', error: error.message }, { status: 500 })
  }
}


