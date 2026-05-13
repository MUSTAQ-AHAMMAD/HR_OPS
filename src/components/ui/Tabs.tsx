'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={cn('w-full', className)}>
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">{activeTabContent}</div>
    </div>
  )
}
