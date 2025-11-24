import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log('🌱 Seeding database with sample data (with tags)...')

    // Create tags first
    const hangingTag = await prisma.tag.create({ data: { name: 'hanging' } })
    const ropeTag = await prisma.tag.create({ data: { name: 'rope' } })
    const twirlTag = await prisma.tag.create({ data: { name: 'twirl' } })
    const bigPotatoTag = await prisma.tag.create({ data: { name: 'big potato' } })
    const testTag = await prisma.tag.create({ data: { name: 'test' } })
    const sampleTag = await prisma.tag.create({ data: { name: 'sample' } })
    const comedyTag = await prisma.tag.create({ data: { name: 'comedy' } })
    const funTag = await prisma.tag.create({ data: { name: 'fun' } })

    console.log('✅ Created 8 tags')

    // Create source strip 1 with tags and rating
    const sourceStrip1 = await prisma.sourceStrip.create({
      data: {
        id: 'A0247',
        yearRange: '1962 - 1967',
        titleChinese: '團團轉',
        format: 6,
        topImageFileBase: 'A0247團團轉',
        titleEnglish: 'Round and Round',
        rating: 3,
        altText: 'Old Master Q stands on a platform to hang up a long rope. Big Potato sees the dangling rope and gleefully runs and jumps up to grab it. His large momentum takes him twirling round and around OMQ many times, until he has tied up OMQ into an angry little corkscrew.',
        tags: {
          create: [
            { tag: { connect: { id: hangingTag.id } } },
            { tag: { connect: { id: ropeTag.id } } },
            { tag: { connect: { id: twirlTag.id } } },
            { tag: { connect: { id: bigPotatoTag.id } } },
          ],
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    console.log(`✅ Created source strip: ${sourceStrip1.id} (rating: ${sourceStrip1.rating}, tags: ${sourceStrip1.tags.map(t => t.tag.name).join(', ')})`)

    // Create source strip 2 with tags
    const sourceStrip2 = await prisma.sourceStrip.create({
      data: {
        id: 'B0936',
        yearRange: '1968 - 1972',
        titleChinese: '測試標題',
        format: 4,
        topImageFileBase: 'B0936測試標題',
        titleEnglish: 'Test Title',
        rating: 1,
        tags: {
          create: [
            { tag: { connect: { id: testTag.id } } },
            { tag: { connect: { id: sampleTag.id } } },
          ],
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    console.log(`✅ Created source strip: ${sourceStrip2.id} (rating: ${sourceStrip2.rating}, tags: ${sourceStrip2.tags.map(t => t.tag.name).join(', ')})`)

    // Create source strip 3 with tags
    const sourceStrip3 = await prisma.sourceStrip.create({
      data: {
        id: 'C1234',
        yearRange: '1973 - 1982',
        titleChinese: '另一個測試',
        format: 12,
        topImageFileBase: 'C1234另一個測試',
        titleEnglish: 'Another Test',
        rating: 2,
        tags: {
          create: [
            { tag: { connect: { id: comedyTag.id } } },
            { tag: { connect: { id: funTag.id } } },
          ],
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    console.log(`✅ Created source strip: ${sourceStrip3.id} (rating: ${sourceStrip3.rating}, tags: ${sourceStrip3.tags.map(t => t.tag.name).join(', ')})`)

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
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    const allTags = await prisma.tag.findMany()

    console.log(`\n📊 Total source strips: ${allSourceStrips.length}`)
    console.log(`📊 Total tags: ${allTags.length}`)
    console.log(`📊 Source strips with published versions: ${allSourceStrips.filter(s => s.publishedStrips.length > 0).length}`)

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
