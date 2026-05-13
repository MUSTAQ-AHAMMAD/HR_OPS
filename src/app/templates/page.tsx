'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import {
  Plus,
  Search,
  Filter,
  FileText,
  Edit2,
  Eye,
  Copy,
  Archive,
  Clock,
  CheckCircle2,
  File,
} from 'lucide-react'

const mockTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    description: 'Welcome new employees to the company',
    status: 'PUBLISHED',
    category: 'Onboarding',
    brandName: 'Acme Corporation',
    lastUpdated: '2024-05-10',
    versions: 3,
  },
  {
    id: '2',
    name: 'Offer Letter',
    description: 'Job offer letter template',
    status: 'PUBLISHED',
    category: 'Recruitment',
    brandName: 'TechStart Inc',
    lastUpdated: '2024-05-08',
    versions: 5,
  },
  {
    id: '3',
    name: 'Performance Review',
    description: 'Annual performance review template',
    status: 'DRAFT',
    category: 'Performance',
    brandName: 'Acme Corporation',
    lastUpdated: '2024-05-12',
    versions: 1,
  },
  {
    id: '4',
    name: 'Exit Interview',
    description: 'Employee exit interview questions',
    status: 'ARCHIVED',
    category: 'Offboarding',
    brandName: 'Global Ventures',
    lastUpdated: '2024-04-20',
    versions: 2,
  },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success'
      case 'DRAFT':
        return 'warning'
      case 'ARCHIVED':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle2 className="h-4 w-4" />
      case 'DRAFT':
        return <Edit2 className="h-4 w-4" />
      case 'ARCHIVED':
        return <Archive className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const publishedTemplates = filteredTemplates.filter((t) => t.status === 'PUBLISHED')
  const draftTemplates = filteredTemplates.filter((t) => t.status === 'DRAFT')
  const archivedTemplates = filteredTemplates.filter((t) => t.status === 'ARCHIVED')

  const TemplateCard = ({ template }: { template: any }) => (
    <Card hover className="group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">{template.name}</h3>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">{template.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge variant={getStatusVariant(template.status)} size="sm">
            {getStatusIcon(template.status)}
            {template.status}
          </Badge>
          <Badge variant="default" size="sm">
            {template.category}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400">
            <Clock className="h-4 w-4" />
            {template.lastUpdated}
          </div>
          <div className="text-secondary-500 dark:text-secondary-400">v{template.versions}</div>
        </div>

        <div className="mt-4 border-t border-secondary-200 pt-4 dark:border-secondary-700">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1" leftIcon={<Eye className="h-4 w-4" />}>
              Preview
            </Button>
            <Button variant="primary" size="sm" className="flex-1" leftIcon={<Edit2 className="h-4 w-4" />}>
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">Templates</h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Create and manage document templates with AI assistance
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />}>
            New Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total</p>
                  <p className="mt-2 text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                    {templates.length}
                  </p>
                </div>
                <FileText className="h-10 w-10 text-secondary-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Published</p>
                  <p className="mt-2 text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                    {publishedTemplates.length}
                  </p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Drafts</p>
                  <p className="mt-2 text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                    {draftTemplates.length}
                  </p>
                </div>
                <Edit2 className="h-10 w-10 text-warning-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Archived</p>
                  <p className="mt-2 text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                    {archivedTemplates.length}
                  </p>
                </div>
                <Archive className="h-10 w-10 text-secondary-400 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                className="max-w-md"
              />
              <Button variant="outline" leftIcon={<Filter className="h-5 w-5" />}>
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates Tabs */}
        <Tabs
          tabs={[
            {
              id: 'all',
              label: 'All Templates',
              icon: <FileText className="h-4 w-4" />,
              content: (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ),
            },
            {
              id: 'published',
              label: `Published (${publishedTemplates.length})`,
              icon: <CheckCircle2 className="h-4 w-4" />,
              content: (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {publishedTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ),
            },
            {
              id: 'drafts',
              label: `Drafts (${draftTemplates.length})`,
              icon: <Edit2 className="h-4 w-4" />,
              content: (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {draftTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ),
            },
            {
              id: 'archived',
              label: `Archived (${archivedTemplates.length})`,
              icon: <Archive className="h-4 w-4" />,
              content: (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {archivedTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </DashboardLayout>
  )
}
