'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { Building2, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
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
            Welcome Back
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-secondary-800">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="admin@hrops.com"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus-visible-ring"
                />
                <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create one
            </Link>
          </div>

          <div className="mt-4 rounded-md bg-info-50 p-4 dark:bg-info-900/20">
            <p className="text-sm text-info-700 dark:text-info-300">
              <strong>Demo credentials:</strong>
              <br />
              Email: admin@hrops.com
              <br />
              Password: Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
