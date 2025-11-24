import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log('🌱 Seeding database with sample data...')

    // Create some source strips
    const sourceStrip1 = await prisma.sourceStrip.create({
      data: {
        id: 'A0247',
        yearRange: '1962 - 1967',
        titleChinese: '團團轉',
        format: 6,
        topImageFileBase: 'A0247團團轉',
        titleEnglish: 'Round and Round',
        tags: ['hanging', 'rope', 'twirl', 'big potato'],
        altText: 'Old Master Q stands on a platform to hang up a long rope. Big Potato sees the dangling rope and gleefully runs and jumps up to grab it. His large momentum takes him twirling round and around OMQ many times, until he has tied up OMQ into an angry little corkscrew.',
      },
    })

    const sourceStrip2 = await prisma.sourceStrip.create({
      data: {
        id: 'B0936',
        yearRange: '1968 - 1972',
        titleChinese: '測試標題',
        format: 4,
        topImageFileBase: 'B0936測試標題',
        titleEnglish: 'Test Title',
        tags: ['test', 'sample'],
      },
    })

    const sourceStrip3 = await prisma.sourceStrip.create({
      data: {
        id: 'C1234',
        yearRange: '1973 - 1982',
        titleChinese: '另一個測試',
        format: 12,
        topImageFileBase: 'C1234另一個測試',
        titleEnglish: 'Another Test',
        tags: ['comedy', 'fun'],
      },
    })

    console.log(`✅ Created source strip: ${sourceStrip1.id}`)
    console.log(`✅ Created source strip: ${sourceStrip2.id}`)
    console.log(`✅ Created source strip: ${sourceStrip3.id}`)

    // Create a published strip
    const publishedStrip = await prisma.publishedStrip.create({
      data: {
        baseFile: 'B0936',
        fileRoot: 'B0936',
        fileExtension: 'jpg',
        is450: false,
        isRTL: false,
        hasBuiltInTitle: true,
      },
    })

    console.log(`✅ Created published strip with ID: ${publishedStrip.id}`)

    // Query to verify
    const allSourceStrips = await prisma.sourceStrip.findMany({
      include: {
        publishedStrips: true,
      },
    })

    console.log(`\n📊 Total source strips in database: ${allSourceStrips.length}`)
    console.log('📊 Source strips with published versions:',
      allSourceStrips.filter(s => s.publishedStrips.length > 0).length
    )

    console.log('\n✨ Seeding completed!')
  } catch (e) {
    console.error('❌ Error seeding database:', e)
    throw e
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    process.exit(1)
  })
