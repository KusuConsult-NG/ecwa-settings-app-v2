"use client"
import { useState, useEffect } from "react"
import { Star, Plus, Search, Filter, Download, Eye, Edit, Trash2, Users, Calendar, Mail, Phone, Crown } from "lucide-react"

interface Executive {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  tenure: string
  status: 'active' | 'inactive' | 'retired'
  bio: string
  achievements: string[]
  photo: string
}

export default function ExecutivePage() {
  const [executives, setExecutives] = useState<Executive[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Simulate loading data
    const executivesData: Executive[] = [
      {
        id: "1",
        name: "Pastor John Doe",
        position: "Senior Pastor",
        department: "Ministry",
        email: "pastor.john@churchflow.com",
        phone: "+234 801 234 5678",
        tenure: "2015 - Present",
        status: "active",
        bio: "Experienced pastor with over 15 years in ministry, leading the church with wisdom and compassion.",
        achievements: ["Led church growth from 200 to 1200+ members", "Established 5 branch churches", "Mentored 20+ pastors"],
        photo: "/api/placeholder/150/150"
      },
      {
        id: "2",
        name: "Elder Jane Smith",
        position: "General Secretary",
        department: "Administration",
        email: "jane.smith@churchflow.com",
        phone: "+234 802 345 6789",
        tenure: "2018 - Present",
        status: "active",
        bio: "Dedicated administrator with expertise in church management and organizational development.",
        achievements: ["Streamlined church administration", "Implemented digital systems", "Trained 50+ volunteers"],
        photo: "/api/placeholder/150/150"
      },
      {
        id: "3",
        name: "Brother Mike Johnson",
        position: "Treasurer",
        department: "Finance",
        email: "mike.johnson@churchflow.com",
        phone: "+234 803 456 7890",
        tenure: "2020 - Present",
        status: "active",
        bio: "Financial expert with CPA certification, ensuring transparent and accountable financial management.",
        achievements: ["Improved financial transparency", "Reduced operational costs by 20%", "Established financial policies"],
        photo: "/api/placeholder/150/150"
      },
      {
        id: "4",
        name: "Sister Sarah Wilson",
        position: "Youth Director",
        department: "Ministry",
        email: "sarah.wilson@churchflow.com",
        phone: "+234 804 567 8901",
        tenure: "2019 - Present",
        status: "active",
        bio: "Passionate youth leader with a heart for young people and innovative ministry approaches.",
        achievements: ["Grew youth ministry to 300+ members", "Organized 20+ youth conferences", "Mentored 100+ young people"],
        photo: "/api/placeholder/150/150"
      },
      {
        id: "5",
        name: "Elder David Brown",
        position: "Elder",
        department: "Ministry",
        email: "david.brown@churchflow.com",
        phone: "+234 805 678 9012",
        tenure: "2016 - 2023",
        status: "retired",
        bio: "Retired elder who served faithfully for 7 years, providing spiritual guidance and wisdom.",
        achievements: ["Served as spiritual mentor", "Led prayer ministry", "Contributed to church growth"],
        photo: "/api/placeholder/150/150"
      }
    ]

    setExecutives(executivesData)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'retired': return 'muted'
      default: return 'muted'
    }
  }

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'Senior Pastor': 'var(--primary)',
      'General Secretary': 'var(--success)',
      'Treasurer': 'var(--warning)',
      'Youth Director': 'var(--danger)',
      'Elder': 'var(--secondary)'
    }
    return colors[position] || 'var(--muted)'
  }

  const filteredExecutives = executives.filter(exec => {
    const matchesSearch = exec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exec.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exec.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = filterPosition === 'all' || exec.position === filterPosition
    const matchesStatus = filterStatus === 'all' || exec.status === filterStatus
    return matchesSearch && matchesPosition && matchesStatus
  })

  const activeExecutives = executives.filter(exec => exec.status === 'active').length
  const totalExecutives = executives.length

  return (
    <div className="container">
      <div className="section-title">
        <h2>Executive Leadership</h2>
        <p>Meet the church leadership team</p>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Executives</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{totalExecutives}</h3>
            </div>
            <Crown className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Active Leaders</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{activeExecutives}</h3>
            </div>
            <Star className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Positions</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(executives.map(e => e.position))].length}</h3>
            </div>
            <Users className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Departments</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(executives.map(e => e.department))].length}</h3>
            </div>
            <Users className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <div style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{position: "relative", flex: "1", minWidth: "300px"}}>
            <Search size={20} style={{position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)"}} />
            <input
              type="text"
              placeholder="Search executives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{paddingLeft: "40px", width: "100%"}}
            />
          </div>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Positions</option>
            <option value="Senior Pastor">Senior Pastor</option>
            <option value="General Secretary">General Secretary</option>
            <option value="Treasurer">Treasurer</option>
            <option value="Youth Director">Youth Director</option>
            <option value="Elder">Elder</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="retired">Retired</option>
          </select>
          <a href="/executive/new" className="btn primary">
            <Plus size={16} />
            Add Executive
          </a>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Executive Cards Grid */}
      <div className="grid cols-3" style={{gap: "1.5rem", marginBottom: "2rem"}}>
        {filteredExecutives.map((exec) => (
          <div key={exec.id} className="card" style={{padding: "1.5rem"}}>
            <div style={{display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem"}}>
              <div style={{
                width: "60px", 
                height: "60px", 
                borderRadius: "50%", 
                backgroundColor: "var(--primary)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold"
              }}>
                {exec.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{flex: 1}}>
                <h3 style={{margin: "0 0 0.25rem 0", fontSize: "1.25rem"}}>{exec.name}</h3>
                <span className="badge" style={{backgroundColor: getPositionColor(exec.position), color: "white"}}>
                  {exec.position}
                </span>
              </div>
            </div>
            
            <p style={{margin: "0 0 1rem 0", color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.5"}}>
              {exec.bio}
            </p>

            <div style={{marginBottom: "1rem"}}>
              <div style={{display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem"}}>
                <Mail size={14} />
                <span style={{fontSize: "0.875rem"}}>{exec.email}</span>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem"}}>
                <Phone size={14} />
                <span style={{fontSize: "0.875rem"}}>{exec.phone}</span>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <Calendar size={14} />
                <span style={{fontSize: "0.875rem"}}>{exec.tenure}</span>
              </div>
            </div>

            <div style={{marginBottom: "1rem"}}>
              <h4 style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: "600"}}>Key Achievements:</h4>
              <ul style={{margin: "0", paddingLeft: "1rem", fontSize: "0.875rem", color: "var(--muted)"}}>
                {exec.achievements.slice(0, 2).map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span className={`status ${getStatusColor(exec.status)}`}>
                {exec.status.charAt(0).toUpperCase() + exec.status.slice(1)}
              </span>
              <div className="btn-group">
                <button className="btn-sm btn-secondary" title="View Profile">
                  <Eye size={14} />
                </button>
                <button className="btn-sm btn-secondary" title="Edit">
                  <Edit size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExecutives.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <Crown size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No executives found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterPosition !== 'all' || filterStatus !== 'all'
              ? "Try adjusting your search or filter criteria"
              : "No executive members have been added yet"
            }
          </p>
          <a href="/executive/new" className="btn primary">
            <Plus size={16} />
            Add Executive
          </a>
        </div>
      )}
    </div>
  )
}
