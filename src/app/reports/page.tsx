"use client"
import { useState, useEffect } from "react"
import { FileText, Download, Calendar, BarChart3, TrendingUp, DollarSign, Users, Building2 } from "lucide-react"

interface Report {
  id: string
  title: string
  type: string
  period: string
  generatedDate: string
  status: 'ready' | 'generating' | 'failed'
  size: string
  generatedBy: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const reportsData: Report[] = [
      {
        id: "1",
        title: "Monthly Financial Report",
        type: "Financial",
        period: "January 2024",
        generatedDate: "2024-01-31",
        status: "ready",
        size: "2.4 MB",
        generatedBy: "John Doe"
      },
      {
        id: "2",
        title: "Member Attendance Report",
        type: "Attendance",
        period: "January 2024",
        generatedDate: "2024-01-30",
        status: "ready",
        size: "1.8 MB",
        generatedBy: "Jane Smith"
      },
      {
        id: "3",
        title: "Expenditure Analysis",
        type: "Financial",
        period: "Q4 2023",
        generatedDate: "2024-01-15",
        status: "ready",
        size: "3.2 MB",
        generatedBy: "Mike Johnson"
      },
      {
        id: "4",
        title: "Annual Summary Report",
        type: "Summary",
        period: "2023",
        generatedDate: "2024-01-01",
        status: "ready",
        size: "5.1 MB",
        generatedBy: "Sarah Wilson"
      }
    ]

    setReports(reportsData)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success'
      case 'generating': return 'warning'
      case 'failed': return 'danger'
      default: return 'muted'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Financial': return <DollarSign size={16} />
      case 'Attendance': return <Users size={16} />
      case 'Summary': return <BarChart3 size={16} />
      default: return <FileText size={16} />
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        title: `${selectedPeriod === 'month' ? 'Monthly' : selectedPeriod === 'quarter' ? 'Quarterly' : 'Annual'} Report`,
        type: "Financial",
        period: new Date().toLocaleDateString('en-NG', { 
          year: 'numeric', 
          month: selectedPeriod === 'month' ? 'long' : undefined 
        }),
        generatedDate: new Date().toISOString().split('T')[0],
        status: "ready",
        size: "2.1 MB",
        generatedBy: "Current User"
      }
      setReports(prev => [newReport, ...prev])
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Reports & Analytics</h2>
        <p>Generate and manage church reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Reports</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{reports.length}</h3>
            </div>
            <FileText className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>This Month</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{reports.filter(r => r.period.includes('January')).length}</h3>
            </div>
            <Calendar className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Ready</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{reports.filter(r => r.status === 'ready').length}</h3>
            </div>
            <TrendingUp className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Types</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(reports.map(r => r.type))].length}</h3>
            </div>
            <BarChart3 className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <h3 style={{margin: "0 0 1rem 0"}}>Generate New Report</h3>
        <div style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Annual</option>
          </select>
          <button 
            className="btn primary" 
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div style={{width: "16px", height: "16px", border: "2px solid transparent", borderTop: "2px solid currentColor", borderRadius: "50%", animation: "spin 1s linear infinite"}}></div>
                Generating...
              </>
            ) : (
              <>
                <FileText size={16} />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Type</th>
                <th>Period</th>
                <th>Generated</th>
                <th>Size</th>
                <th>Status</th>
                <th>Generated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                      {getTypeIcon(report.type)}
                      <div>
                        <div style={{fontWeight: "500"}}>{report.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{backgroundColor: "var(--primary)", color: "white"}}>
                      {report.type}
                    </span>
                  </td>
                  <td>{report.period}</td>
                  <td>{formatDate(report.generatedDate)}</td>
                  <td>{report.size}</td>
                  <td>
                    <span className={`status ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td>{report.generatedBy}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-sm btn-primary" title="Download" disabled={report.status !== 'ready'}>
                        <Download size={14} />
                      </button>
                      <button className="btn-sm btn-secondary" title="View">
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reports.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <FileText size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No reports found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            Generate your first report to get started
          </p>
          <button className="btn primary" onClick={generateReport}>
            <FileText size={16} />
            Generate Report
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

