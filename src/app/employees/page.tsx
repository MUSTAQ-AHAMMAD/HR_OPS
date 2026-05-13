'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Search, Filter, Download, RefreshCw, Users, Mail, Phone, MapPin } from 'lucide-react'

const mockEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    officeLocation: 'San Francisco',
    phoneNumber: '+1 (555) 123-4567',
    isActive: true,
    syncedAt: '2024-05-13 09:30',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    jobTitle: 'Product Manager',
    department: 'Product',
    officeLocation: 'New York',
    phoneNumber: '+1 (555) 234-5678',
    isActive: true,
    syncedAt: '2024-05-13 09:30',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@company.com',
    jobTitle: 'HR Manager',
    department: 'Human Resources',
    officeLocation: 'San Francisco',
    phoneNumber: '+1 (555) 345-6789',
    isActive: true,
    syncedAt: '2024-05-13 09:30',
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@company.com',
    jobTitle: 'UX Designer',
    department: 'Design',
    officeLocation: 'Austin',
    phoneNumber: '+1 (555) 456-7890',
    isActive: false,
    syncedAt: '2024-05-10 14:20',
  },
]

const departments = ['All Departments', 'Engineering', 'Product', 'Design', 'Human Resources', 'Marketing', 'Sales']
const locations = ['All Locations', 'San Francisco', 'New York', 'Austin', 'Remote']

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSyncing(false)
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      selectedDepartment === 'All Departments' || employee.department === selectedDepartment

    const matchesLocation =
      selectedLocation === 'All Locations' || employee.officeLocation === selectedLocation

    return matchesSearch && matchesDepartment && matchesLocation
  })

  const activeEmployees = employees.filter((e) => e.isActive).length
  const totalDepartments = new Set(employees.map((e) => e.department)).size

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">Employees</h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Manage employee data synced from Microsoft Outlook
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />}
            onClick={handleSync}
            isLoading={isSyncing}
          >
            Sync with Outlook
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Employees</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {employees.length}
                  </p>
                </div>
                <Users className="h-12 w-12 text-primary-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Active</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {activeEmployees}
                  </p>
                </div>
                <Users className="h-12 w-12 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Departments</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {totalDepartments}
                  </p>
                </div>
                <MapPin className="h-12 w-12 text-info-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Last Sync</p>
                  <p className="mt-2 text-sm font-medium text-secondary-900 dark:text-secondary-50">
                    {employees[0]?.syncedAt || 'Never'}
                  </p>
                </div>
                <RefreshCw className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                className="flex-1 max-w-md"
              />
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                options={departments.map((d) => ({ value: d, label: d }))}
                className="w-full md:w-48"
              />
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                options={locations.map((l) => ({ value: l, label: l }))}
                className="w-full md:w-48"
              />
              <Button variant="outline" leftIcon={<Download className="h-5 w-5" />}>
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Employees ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-medium">
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-50">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-secondary-500">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-secondary-900 dark:text-secondary-50">{employee.jobTitle}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" size="sm">
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                        <MapPin className="h-3 w-3" />
                        {employee.officeLocation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                        <Phone className="h-3 w-3" />
                        {employee.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.isActive ? 'success' : 'default'} size="sm">
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
