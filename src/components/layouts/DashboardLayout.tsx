'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2,
  FileText,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Brands', href: '/brands', icon: Building2 },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-50 dark:bg-secondary-900">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-secondary-200 bg-white transition-transform duration-300 ease-in-out dark:border-secondary-700 dark:bg-secondary-800 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-secondary-200 px-6 dark:border-secondary-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-secondary-900 dark:text-secondary-50">HR Ops</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-secondary-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-secondary-200 p-4 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white font-medium">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate dark:text-secondary-50">
                Admin User
              </p>
              <p className="text-xs text-secondary-500 truncate dark:text-secondary-400">admin@hrops.com</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-start" leftIcon={<LogOut className="h-4 w-4" />}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-6 dark:border-secondary-700 dark:bg-secondary-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-secondary-500 hover:text-secondary-700 lg:hidden dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md ml-4 lg:ml-0">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-secondary-300 bg-secondary-50 py-2 pl-10 pr-4 text-sm text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-700 dark:hover:text-secondary-300">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error-500"></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
