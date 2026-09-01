import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const newsletters = await db.newsletterSignup.findMany({
    select: { email: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  console.log('=== NEWSLETTER SIGNUPS (últimos 5) ===')
  console.table(newsletters)

  const inquiries = await db.contactInquiry.findMany({
    select: { name: true, email: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  console.log('=== CONTACT INQUIRIES (últimos 5) ===')
  console.table(inquiries)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
