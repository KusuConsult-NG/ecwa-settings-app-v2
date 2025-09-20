import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, Download } from "lucide-react";

export default function ExpendituresPage() {
  const expenditures = [
    {
      id: "EXP-001",
      description: "Office Supplies",
      amount: 15000,
      status: "Approved",
      date: "2024-01-15",
      category: "Administrative"
    },
    {
      id: "EXP-002", 
      description: "Travel Expenses",
      amount: 45000,
      status: "Pending",
      date: "2024-01-14",
      category: "Travel"
    },
    {
      id: "EXP-003",
      description: "Equipment Purchase",
      amount: 120000,
      status: "Approved",
      date: "2024-01-13",
      category: "Equipment"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenditures</h1>
          <p className="text-gray-600">Manage and track organizational expenses</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Expenditure
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search expenditures..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option>All Categories</option>
                <option>Administrative</option>
                <option>Travel</option>
                <option>Equipment</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenditures Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Expenditures</CardTitle>
              <CardDescription>List of all expenditure requests</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((expenditure) => (
                  <tr key={expenditure.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{expenditure.id}</td>
                    <td className="py-3 px-4">{expenditure.description}</td>
                    <td className="py-3 px-4">₦{expenditure.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expenditure.status === 'Approved' 
                          ? 'bg-green-100 text-green-800'
                          : expenditure.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {expenditure.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{expenditure.date}</td>
                    <td className="py-3 px-4">{expenditure.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
