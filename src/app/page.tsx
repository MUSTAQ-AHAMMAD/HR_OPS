import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Building2, FileText, Users, BarChart3, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white/80 backdrop-blur-sm dark:border-secondary-700 dark:bg-secondary-800/80">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
              HR Operations
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="mb-4 text-5xl font-bold text-secondary-900 dark:text-secondary-50">
            Enterprise HR Operations Platform
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-secondary-600 dark:text-secondary-400">
            Streamline your HR processes with AI-powered template management, brand consistency,
            and seamless employee data synchronization.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" leftIcon={<Sparkles className="h-5 w-5" />}>
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Building2 className="h-8 w-8" />}
            title="Brand Management"
            description="Create and manage multiple brands with custom colors, logos, and assets."
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="Template Library"
            description="AI-powered templates with version control and grammar checking."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Employee Sync"
            description="Seamless integration with Outlook for automatic employee data updates."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Analytics"
            description="Comprehensive usage statistics and insights into your operations."
          />
        </div>

        {/* Key Benefits */}
        <div className="mt-20 rounded-2xl bg-white p-12 shadow-xl dark:bg-secondary-800">
          <h3 className="mb-8 text-center text-3xl font-bold text-secondary-900 dark:text-secondary-50">
            Why Choose HR Operations Platform?
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <Benefit
              title="Enterprise-Grade Security"
              description="Built with security best practices, including encryption, authentication, and comprehensive audit logs."
            />
            <Benefit
              title="AI-Powered"
              description="Leverage OpenAI for grammar checking, content suggestions, and intelligent template generation."
            />
            <Benefit
              title="Scalable Architecture"
              description="Built on Next.js 14 and PostgreSQL with TypeScript for type-safe, production-ready code."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white/80 backdrop-blur-sm py-8 dark:border-secondary-700 dark:bg-secondary-800/80 mt-20">
        <div className="container mx-auto px-6 text-center text-secondary-600 dark:text-secondary-400">
          <p>&copy; 2024 HR Operations Platform. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-secondary-800">
      <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-secondary-900 dark:text-secondary-50">
        {title}
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400">{description}</p>
    </div>
  )
}

function Benefit({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h4 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-secondary-50">
        {title}
      </h4>
      <p className="text-secondary-600 dark:text-secondary-400">{description}</p>
    </div>
  )
}
