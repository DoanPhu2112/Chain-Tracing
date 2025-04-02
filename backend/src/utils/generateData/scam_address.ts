import fs from 'fs'
import path from 'path'
import csvParser from 'csv-parser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const filePath = path.join(__dirname, './scam_addresses.csv') // path to your CSV file

async function main() {
  const records: {
    address: string
    label: string
    nameTag: string
  }[] = []

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      records.push({
        address: row.address.trim(),
        label: row.label.trim(),
        nameTag: row.nameTag.trim(),
      })
    })
    .on('end', async () => {
      console.log(`Parsed ${records.length} records.`)

      for (const record of records) {
        try {
          await prisma.tag.upsert({
            where: { address: record.address },
            update: {
              label: record.label,
              nameTag: record.nameTag,
            },
            create: record,
          })
          console.log(`Saved: ${record.address}`)
        } catch (err) {
          console.error(`Error saving ${record.address}:`, err)
        }
      }

      await prisma.$disconnect()
    })
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
