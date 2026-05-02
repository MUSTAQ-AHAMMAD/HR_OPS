import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hrops.com' },
    update: {},
    create: {
      email: 'admin@hrops.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create sample brand
  const brand = await prisma.brand.create({
    data: {
      name: 'Acme Corporation',
      description: 'Leading technology solutions provider',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      createdById: adminUser.id,
    },
  })

  console.log('Created sample brand:', brand.name)

  // Create sample template
  const template = await prisma.template.create({
    data: {
      name: 'Welcome Email Template',
      description: 'Standard welcome email for new employees',
      content: `
        <h1>Welcome to {{company_name}}!</h1>
        <p>Dear {{employee_name}},</p>
        <p>We are thrilled to have you join our team as {{job_title}} in the {{department}} department.</p>
        <p>Your start date is {{start_date}}.</p>
        <p>Best regards,<br/>HR Team</p>
      `,
      category: 'Onboarding',
      tags: ['welcome', 'onboarding', 'new-hire'],
      status: 'PUBLISHED',
      brandId: brand.id,
      createdById: adminUser.id,
      publishedAt: new Date(),
    },
  })

  console.log('Created sample template:', template.name)

  // Create sample employees
  const employees = await prisma.employee.createMany({
    data: [
      {
        email: 'john.doe@acme.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        officeLocation: 'New York, NY',
        phoneNumber: '+1-555-0100',
      },
      {
        email: 'jane.smith@acme.com',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        jobTitle: 'Product Manager',
        department: 'Product',
        officeLocation: 'San Francisco, CA',
        phoneNumber: '+1-555-0101',
      },
      {
        email: 'bob.johnson@acme.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        displayName: 'Bob Johnson',
        jobTitle: 'HR Manager',
        department: 'Human Resources',
        officeLocation: 'Austin, TX',
        phoneNumber: '+1-555-0102',
      },
    ],
  })

  console.log(`Created ${employees.count} sample employees`)

  // Create activity log entry
  await prisma.activityLog.create({
    data: {
      userId: adminUser.id,
      action: 'system_seed',
      resource: 'database',
      details: {
        message: 'Database seeded with initial data',
      },
    },
  })

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
