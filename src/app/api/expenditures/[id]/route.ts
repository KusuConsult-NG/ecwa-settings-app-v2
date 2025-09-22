import { NextRequest, NextResponse } from 'next/server'
import { updateExpenditureStatus } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, approvedBy } = await request.json()
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid status. Must be pending, approved, or rejected' 
      }, { status: 400 })
    }

    const updatedExpenditure = updateExpenditureStatus(
      params.id, 
      status, 
      approvedBy || 'Current User'
    )
    
    if (!updatedExpenditure) {
      return NextResponse.json({ 
        success: false, 
        message: 'Expenditure not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedExpenditure 
    })
  } catch (error: any) {
    console.error('Error updating expenditure status:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update expenditure status', 
      error: error.message 
    }, { status: 500 })
  }
}
