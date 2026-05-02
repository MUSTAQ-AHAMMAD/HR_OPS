'use client'

import { useState } from 'react'
import Link from 'link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { Building2, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Registration successful! Please login.')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4 dark:from-secondary-900 dark:to-secondary-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Building2 className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">
            Create Account
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Get started with HR Operations Platform
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-secondary-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-secondary-300 bg-white py-2 pl-10 pr-4 text-secondary-900 focus-visible-ring dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-secondary-300 bg-white py-2 pl-10 pr-4 text-secondary-900 focus-visible-ring dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-md border border-secondary-300 bg-white py-2 pl-10 pr-4 text-secondary-900 focus-visible-ring dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-secondary-500">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full rounded-md border border-secondary-300 bg-white py-2 pl-10 pr-4 text-secondary-900 focus-visible-ring dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
