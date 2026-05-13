'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  MoreVertical,
  Building2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

// Mock data
const mockBrands = [
  {
    id: '1',
    name: 'Acme Corporation',
    description: 'Leading technology company',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'TechStart Inc',
    description: 'Innovative startup solutions',
    primaryColor: '#8B5CF6',
    secondaryColor: '#F59E0B',
    isActive: true,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Global Ventures',
    description: 'International business',
    primaryColor: '#EF4444',
    secondaryColor: '#06B6D4',
    isActive: false,
    createdAt: '2024-03-10',
  },
]

export default function BrandsPage() {
  const [brands, setBrands] = useState(mockBrands)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<any>(null)

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">Brands</h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Manage your organization's brands and styling
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Brand
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Brands</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {brands.length}
                  </p>
                </div>
                <Building2 className="h-12 w-12 text-primary-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Active Brands</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {brands.filter((b) => b.isActive).length}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Inactive Brands</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {brands.filter((b) => !b.isActive).length}
                  </p>
                </div>
                <XCircle className="h-12 w-12 text-error-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <Input
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                  className="max-w-md"
                />
                <Button variant="outline" leftIcon={<Filter className="h-5 w-5" />}>
                  Filter
                </Button>
              </div>
              <Button variant="outline" leftIcon={<Download className="h-5 w-5" />}>
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brands Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Brands ({filteredBrands.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Colors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold">
                          {brand.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-50">{brand.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{brand.description}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded border border-secondary-300 dark:border-secondary-600"
                          style={{ backgroundColor: brand.primaryColor }}
                          title="Primary Color"
                        />
                        <div
                          className="h-6 w-6 rounded border border-secondary-300 dark:border-secondary-600"
                          style={{ backgroundColor: brand.secondaryColor }}
                          title="Secondary Color"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={brand.isActive ? 'success' : 'default'}>
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{brand.createdAt}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBrand(brand)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-error-600" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!selectedBrand}
        onClose={() => {
          setIsCreateModalOpen(false)
          setSelectedBrand(null)
        }}
        title={selectedBrand ? 'Edit Brand' : 'Create New Brand'}
      >
        <div className="space-y-4">
          <Input label="Brand Name" placeholder="Enter brand name" />
          <Input label="Description" placeholder="Enter description" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Primary Color" type="color" defaultValue="#3B82F6" />
            <Input label="Secondary Color" type="color" defaultValue="#10B981" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setSelectedBrand(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="primary">{selectedBrand ? 'Update' : 'Create'} Brand</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
