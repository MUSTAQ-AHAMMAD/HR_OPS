'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Building2,
  Activity,
  Download,
  Calendar,
} from 'lucide-react'

// Mock data for analytics
const analyticsData = {
  overview: {
    totalUsers: { value: 18, change: '+12%', trend: 'up' },
    totalBrands: { value: 12, change: '+2', trend: 'up' },
    totalTemplates: { value: 48, change: '+8', trend: 'up' },
    totalEmployees: { value: 235, change: '+15', trend: 'up' },
  },
  topDepartments: [
    { name: 'Engineering', count: 45, percentage: 19 },
    { name: 'Sales', count: 38, percentage: 16 },
    { name: 'Marketing', count: 32, percentage: 14 },
    { name: 'Human Resources', count: 28, percentage: 12 },
    { name: 'Product', count: 25, percentage: 11 },
  ],
  templateUsage: [
    { name: 'Welcome Email', uses: 156, category: 'Onboarding' },
    { name: 'Offer Letter', uses: 89, category: 'Recruitment' },
    { name: 'Performance Review', uses: 67, category: 'Performance' },
    { name: 'Exit Interview', uses: 23, category: 'Offboarding' },
  ],
  recentActivity: [
    {
      user: 'John Doe',
      action: 'created',
      resource: 'brand',
      name: 'TechStart Inc',
      time: '2 hours ago',
    },
    {
      user: 'Jane Smith',
      action: 'published',
      resource: 'template',
      name: 'Welcome Email',
      time: '4 hours ago',
    },
    {
      user: 'System',
      action: 'synced',
      resource: 'employees',
      name: '235 employees',
      time: '6 hours ago',
    },
  ],
  monthlyTrends: [
    { month: 'Jan', templates: 35, brands: 8, employees: 200 },
    { month: 'Feb', templates: 38, brands: 9, employees: 210 },
    { month: 'Mar', templates: 42, brands: 10, employees: 220 },
    { month: 'Apr', templates: 45, brands: 11, employees: 228 },
    { month: 'May', templates: 48, brands: 12, employees: 235 },
  ],
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">Analytics</h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Insights and statistics for your HR operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" leftIcon={<Calendar className="h-5 w-5" />}>
              Last 30 Days
            </Button>
            <Button variant="outline" leftIcon={<Download className="h-5 w-5" />}>
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Active Users</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {analyticsData.overview.totalUsers.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    {analyticsData.overview.totalUsers.change} from last month
                  </div>
                </div>
                <Users className="h-12 w-12 text-primary-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Brands</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {analyticsData.overview.totalBrands.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    {analyticsData.overview.totalBrands.change} new brands
                  </div>
                </div>
                <Building2 className="h-12 w-12 text-info-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Templates</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {analyticsData.overview.totalTemplates.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    {analyticsData.overview.totalTemplates.change} this month
                  </div>
                </div>
                <FileText className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Employees</p>
                  <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
                    {analyticsData.overview.totalEmployees.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    {analyticsData.overview.totalEmployees.change} new hires
                  </div>
                </div>
                <Users className="h-12 w-12 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Departments */}
          <Card>
            <CardHeader>
              <CardTitle>Top Departments</CardTitle>
              <CardDescription>Employee distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topDepartments.map((dept, index) => (
                  <div key={dept.name} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600 dark:bg-primary-900/20">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                          {dept.name}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {dept.count} employees
                        </p>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-700">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                          style={{ width: `${dept.percentage * 5}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Most Used Templates</CardTitle>
              <CardDescription>Popular templates by usage count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.templateUsage.map((template) => (
                  <div key={template.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                          {template.name}
                        </p>
                        <Badge variant="default" size="sm" className="mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary-900 dark:text-secondary-50">
                        {template.uses}
                      </p>
                      <p className="text-xs text-secondary-500">uses</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Month-over-month growth across key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analyticsData.monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    {month.month}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-700">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${(month.templates / 50) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm text-secondary-600 dark:text-secondary-400">
                        {month.templates} templates
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-700">
                        <div
                          className="h-full bg-info-500"
                          style={{ width: `${(month.brands / 12) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm text-secondary-600 dark:text-secondary-400">
                        {month.brands} brands
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-secondary-100 pb-4 last:border-0 last:pb-0 dark:border-secondary-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-medium dark:bg-primary-900/20">
                    {activity.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900 dark:text-secondary-50">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.resource}</span>{' '}
                      <span className="text-secondary-600 dark:text-secondary-400">{activity.name}</span>
                    </p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                  <Activity className="h-5 w-5 text-secondary-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
