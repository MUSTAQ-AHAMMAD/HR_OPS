import Link from 'next/link'
import { Building2, FileText, Users, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white dark:border-secondary-700 dark:bg-secondary-800">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary-600" />
              <h1 className="text-xl font-bold text-secondary-900 dark:text-secondary-50">
                HR Operations
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <NavLink href="/dashboard" active>
                Dashboard
              </NavLink>
              <NavLink href="/brands">Brands</NavLink>
              <NavLink href="/templates">Templates</NavLink>
              <NavLink href="/employees">Employees</NavLink>
              <NavLink href="/analytics">Analytics</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="mb-6 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
          Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Brands" value="12" icon={<Building2 />} trend="+2 this month" />
          <StatCard title="Templates" value="48" icon={<FileText />} trend="+8 this month" />
          <StatCard title="Employees" value="235" icon={<Users />} trend="+15 this month" />
          <StatCard
            title="Active Users"
            value="18"
            icon={<BarChart3 />}
            trend="3 online now"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-secondary-900 dark:text-secondary-50">
            Quick Actions
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard
              title="Create New Brand"
              description="Add a new brand with custom styling"
              href="/brands/new"
              icon={<Building2 />}
            />
            <ActionCard
              title="New Template"
              description="Create a template with AI assistance"
              href="/templates/new"
              icon={<FileText />}
            />
            <ActionCard
              title="Sync Employees"
              description="Update employee data from Outlook"
              href="/employees/sync"
              icon={<Users />}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-secondary-900 dark:text-secondary-50">
            Recent Activity
          </h3>
          <div className="rounded-lg bg-white shadow dark:bg-secondary-800">
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
        </div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        active
          ? 'text-primary-600'
          : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-50'
      }`}
    >
      {children}
    </Link>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-secondary-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-secondary-50">
            {value}
          </p>
          <p className="mt-2 text-sm text-success-600">{trend}</p>
        </div>
        <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900/20">
          {icon}
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-secondary-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-600"
    >
      <div className="mb-3 inline-flex rounded-lg bg-primary-100 p-2 text-primary-600 dark:bg-primary-900/20">
        {icon}
      </div>
      <h4 className="mb-2 font-semibold text-secondary-900 group-hover:text-primary-600 dark:text-secondary-50">
        {title}
      </h4>
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
    <div className="flex items-center justify-between border-b border-secondary-100 px-6 py-4 last:border-b-0 dark:border-secondary-700">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium dark:bg-primary-900/20">
          {user[0]}
        </div>
        <div>
          <p className="text-sm text-secondary-900 dark:text-secondary-50">
            <span className="font-medium">{user}</span> {action}{' '}
            <span className="font-medium">{target}</span>
          </p>
          <p className="text-xs text-secondary-500">{time}</p>
        </div>
      </div>
    </div>
  )
}
