'use client'

import React from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Building2,
  FileText,
  Users,
  BarChart3,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">
            Welcome back, Admin 👋
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Here's what's happening with your HR operations today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Brands</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">12</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    +2 this month
                  </div>
                </div>
                <Building2 className="h-12 w-12 text-primary-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Templates</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">48</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    +8 this month
                  </div>
                </div>
                <FileText className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Employees</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">235</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    +15 this month
                  </div>
                </div>
                <Users className="h-12 w-12 text-info-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Active Users</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">18</p>
                  <div className="mt-2 text-sm text-secondary-500">3 online now</div>
                </div>
                <BarChart3 className="h-12 w-12 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-secondary-900 dark:text-secondary-50">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard
              title="Create New Brand"
              description="Add a new brand with custom styling"
              href="/brands"
              icon={<Building2 className="h-5 w-5" />}
              color="primary"
            />
            <ActionCard
              title="New Template"
              description="Create a template with AI assistance"
              href="/templates"
              icon={<FileText className="h-5 w-5" />}
              color="purple"
            />
            <ActionCard
              title="Sync Employees"
              description="Update employee data from Outlook"
              href="/employees"
              icon={<Users className="h-5 w-5" />}
              color="info"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  user="Admin User"
                  action="created a new brand"
                  target="Acme Corporation"
                  time="2 hours ago"
                />
                <ActivityItem
                  user="Jane Smith"
                  action="updated template"
                  target="Welcome Email"
                  time="4 hours ago"
                />
                <ActivityItem
                  user="System"
                  action="synced employees"
                  target="235 employees"
                  time="6 hours ago"
                />
                <ActivityItem
                  user="Bob Johnson"
                  action="published template"
                  target="Onboarding Checklist"
                  time="1 day ago"
                />
              </div>
              <Link href="/analytics">
                <Button variant="ghost" className="mt-4 w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All Activity
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Template Status */}
          <Card>
            <CardHeader>
              <CardTitle>Template Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StatusItem label="Published" count={32} total={48} color="success" />
                <StatusItem label="Drafts" count={10} total={48} color="warning" />
                <StatusItem label="Archived" count={6} total={48} color="default" />
              </div>
              <Link href="/templates">
                <Button variant="ghost" className="mt-4 w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Manage Templates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: 'primary' | 'purple' | 'info'
}) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 group-hover:bg-primary-200',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 group-hover:bg-purple-200',
    info: 'bg-info-100 text-info-600 dark:bg-info-900/20 group-hover:bg-info-200',
  }

  return (
    <Link
      href={href}
      className="group rounded-lg border border-secondary-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-600"
    >
      <div className={`mb-3 inline-flex rounded-lg p-3 transition-colors ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-secondary-900 group-hover:text-primary-600 dark:text-secondary-50">
        {title}
      </h3>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">{description}</p>
    </Link>
  )
}

function ActivityItem({
  user,
  action,
  target,
  time,
}: {
  user: string
  action: string
  target: string
  time: string
}) {
  return (
    <div className="flex items-center gap-4 border-b border-secondary-100 pb-4 last:border-0 last:pb-0 dark:border-secondary-700">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-medium dark:bg-primary-900/20">
        {user[0]}
      </div>
      <div className="flex-1">
        <p className="text-sm text-secondary-900 dark:text-secondary-50">
          <span className="font-medium">{user}</span> {action}{' '}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-secondary-500">{time}</p>
      </div>
    </div>
  )
}

function StatusItem({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: 'success' | 'warning' | 'default'
}) {
  const percentage = (count / total) * 100
  const colorClasses = {
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    default: 'bg-secondary-400',
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-secondary-900 dark:text-secondary-50">{label}</span>
        <span className="text-sm text-secondary-600 dark:text-secondary-400">
          {count} / {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-700">
        <div className={`h-full ${colorClasses[color]}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
