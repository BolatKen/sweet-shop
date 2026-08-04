import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting SweetShop database seeding...')

  // 1. Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const managerPassword = await bcrypt.hash('manager123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@sweetshop.kz',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@sweetshop.kz',
      passwordHash: managerPassword,
      role: 'MANAGER',
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: 'customer@sweetshop.kz',
      passwordHash: userPassword,
      role: 'CUSTOMER',
    },
  })

  console.log('✅ Created users (Admin, Manager, Customer)')

  // 3. Create Categories
  const catMen = await prisma.category.create({
    data: { name: "Men's Streetwear", slug: 'men' },
  })

  const catWomen = await prisma.category.create({
    data: { name: "Women's Collection", slug: 'women' },
  })

  const catOuterwear = await prisma.category.create({
    data: { name: 'Outerwear & Jackets', slug: 'outerwear' },
  })

  const catHoodies = await prisma.category.create({
    data: { name: 'Hoodies & Sweatshirts', slug: 'hoodies' },
  })

  const catShoes = await prisma.category.create({
    data: { name: 'Sneakers & Shoes', slug: 'shoes' },
  })

  const catAccessories = await prisma.category.create({
    data: { name: 'Accessories & Bags', slug: 'accessories' },
  })

  console.log('✅ Created categories')

  // 4. Create Products & Variants
  const productsData = [
    {
      name: "Air Force 1 '07 Premium",
      slug: 'air-force-1-07-premium',
      description: 'The radiance lives on in the Air Force 1 ’07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine.',
      images: [
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catShoes.id,
      variants: [
        { size: '40', color: 'White', price: 5899000, stock: 12 },
        { size: '41', color: 'White', price: 5899000, stock: 15 },
        { size: '42', color: 'White', price: 5899000, stock: 8 },
        { size: '43', color: 'Black', price: 5899000, stock: 10 },
        { size: '44', color: 'Black', price: 5899000, stock: 6 },
      ],
    },
    {
      name: 'SweetClub Heavyweight Fleece Hoodie',
      slug: 'sweetclub-heavyweight-fleece-hoodie',
      description: 'Crafted from 450GSM combed cotton fleece with dropped shoulders and a double-layered hood. Built for extreme comfort and structured oversized drape.',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catHoodies.id,
      variants: [
        { size: 'S', color: 'Black', price: 3499000, stock: 20 },
        { size: 'M', color: 'Black', price: 3499000, stock: 25 },
        { size: 'L', color: 'Black', price: 3499000, stock: 18 },
        { size: 'XL', color: 'Heather Gray', price: 3499000, stock: 14 },
      ],
    },
    {
      name: 'Tech Fleece Windrunner Jacket',
      slug: 'tech-fleece-windrunner-jacket',
      description: 'Lightweight warmth meets classic Windrunner style lines. Premium smooth fleece on both sides feels warmer and softer than ever while keeping a lightweight build.',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catOuterwear.id,
      variants: [
        { size: 'M', color: 'Obsidian Navy', price: 6499000, stock: 7 },
        { size: 'L', color: 'Obsidian Navy', price: 6499000, stock: 9 },
        { size: 'XL', color: 'Smoke Gray', price: 6499000, stock: 5 },
      ],
    },
    {
      name: "Air Max 270 React 'Triple Black'",
      slug: 'air-max-270-react-triple-black',
      description: 'Boasting the biggest Max Air unit yet, the Air Max 270 delivers unrivaled, all-day comfort with bold aesthetic lines.',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catShoes.id,
      variants: [
        { size: '41', color: 'Triple Black', price: 7299000, stock: 10 },
        { size: '42', color: 'Triple Black', price: 7299000, stock: 14 },
        { size: '43', color: 'Triple Black', price: 7299000, stock: 11 },
        { size: '44', color: 'Triple Black', price: 7299000, stock: 4 },
      ],
    },
    {
      name: 'Essential Athletic Cargo Trousers',
      slug: 'essential-athletic-cargo-trousers',
      description: 'Relaxed fit athletic trousers featuring water-repellent ripstop fabric, adjustable drawcord cuffs, and spacious cargo utility pockets.',
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catMen.id,
      variants: [
        { size: 'M', color: 'Matte Black', price: 2999000, stock: 16 },
        { size: 'L', color: 'Matte Black', price: 2999000, stock: 22 },
        { size: 'XL', color: 'Olive Green', price: 2999000, stock: 12 },
      ],
    },
    {
      name: 'Heritage Utility Backpack 25L',
      slug: 'heritage-utility-backpack-25l',
      description: 'Durable 600D polyester backpack with padded laptop sleeve, water bottle pocket, and reinforced ergonomic shoulder straps.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catAccessories.id,
      variants: [
        { size: 'One Size', color: 'Stealth Black', price: 2299000, stock: 30 },
        { size: 'One Size', color: 'Wolf Gray', price: 2299000, stock: 18 },
      ],
    },
    {
      name: 'Women Oversized Graphic Boxy Tee',
      slug: 'women-oversized-graphic-boxy-tee',
      description: 'Heavyweight organic cotton jersey T-shirt featuring vintage SweetShop chest crest print and subtle distressed collar detailing.',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catWomen.id,
      variants: [
        { size: 'S', color: 'Off White', price: 1899000, stock: 15 },
        { size: 'M', color: 'Off White', price: 1899000, stock: 20 },
        { size: 'L', color: 'Washed Black', price: 1899000, stock: 14 },
      ],
    },
  ]

  for (const item of productsData) {
    const { variants, ...productInfo } = item
    const createdProduct = await prisma.product.create({
      data: {
        ...productInfo,
        variants: {
          create: variants,
        },
      },
      include: {
        variants: true,
      },
    })
  }

  console.log('✅ Created products & product variants')

  // 5. Create Sample Orders for Demo
  const firstVariant = await prisma.productVariant.findFirst()
  if (firstVariant) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'PAID',
        total: firstVariant.price,
        deliveryAddress: 'Abay Ave 150, Apt 42, Almaty, Kazakhstan',
        items: {
          create: {
            variantId: firstVariant.id,
            quantity: 1,
            price: firstVariant.price,
          },
        },
      },
    })

    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'SHIPPED',
        total: firstVariant.price * 2,
        deliveryAddress: 'Dostyk Ave 89, Suite 12, Almaty, Kazakhstan',
        items: {
          create: {
            variantId: firstVariant.id,
            quantity: 2,
            price: firstVariant.price,
          },
        },
      },
    })
  }

  console.log('✅ Created sample order history for demonstration')
  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
