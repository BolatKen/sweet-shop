import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting SweetShop database seeding...')

  // ------------------------------------------------------------------
  // 1. Users  (upsert — skipped if email already exists)
  // ------------------------------------------------------------------
  const [adminHash, managerHash, customerHash] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('manager123', 10),
    bcrypt.hash('user123', 10),
  ])

  const [admin, , customer] = await Promise.all([
    prisma.user.upsert({
      where:  { email: 'admin@sweetshop.kz' },
      update: {},
      create: { email: 'admin@sweetshop.kz', passwordHash: adminHash, role: 'ADMIN' },
    }),
    prisma.user.upsert({
      where:  { email: 'manager@sweetshop.kz' },
      update: {},
      create: { email: 'manager@sweetshop.kz', passwordHash: managerHash, role: 'MANAGER' },
    }),
    prisma.user.upsert({
      where:  { email: 'customer@sweetshop.kz' },
      update: {},
      create: { email: 'customer@sweetshop.kz', passwordHash: customerHash, role: 'CUSTOMER' },
    }),
  ])
  console.log('Upserted users (admin / manager / customer)')

  // ------------------------------------------------------------------
  // 2. Categories  (upsert by slug)
  // ------------------------------------------------------------------
  const upsertCat = (name: string, slug: string) =>
    prisma.category.upsert({ where: { slug }, update: {}, create: { name, slug } })

  const [catShoes, catHoodies, catOuterwear, catMen, catWomen, catAccessories] =
    await Promise.all([
      upsertCat('Sneakers & Shoes',    'shoes'),
      upsertCat('Hoodies & Sweatshirts','hoodies'),
      upsertCat('Outerwear & Jackets', 'outerwear'),
      upsertCat("Men's Streetwear",    'men'),
      upsertCat("Women's Collection",  'women'),
      upsertCat('Accessories & Bags',  'accessories'),
    ])
  console.log('Upserted 6 categories')

  // ------------------------------------------------------------------
  // 3. Products  (upsert by slug; variants are only created if the
  //               product itself is new — existing variants untouched)
  // ------------------------------------------------------------------
  type VariantInput = { size: string; color: string; price: number; stock: number }
  type ProductInput = {
    name: string
    slug: string
    description: string
    images: string[]
    categoryId: string
    variants: VariantInput[]
  }

  const products: ProductInput[] = [
    // ---- SHOES -------------------------------------------------------
    {
      name: "Air Force 1 '07 Premium",
      slug: 'air-force-1-07-premium',
      description:
        "The Air Force 1 '07 puts a fresh spin on the b-ball icon with crisp leather, bold colors and just the right amount of flash. A heritage silhouette built for the streets.",
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
      name: 'Air Jordan 1 High OG Chicago',
      slug: 'air-jordan-1-high-og-chicago',
      description:
        'The Air Jordan 1 High OG Chicago is a legendary sneaker featuring premium leather construction in the iconic white, varsity red, and black colorway with the original Wings logo.',
      images: [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catShoes.id,
      variants: [
        { size: '41', color: 'Varsity Red/White', price: 8999000, stock: 5 },
        { size: '42', color: 'Varsity Red/White', price: 8999000, stock: 8 },
        { size: '43', color: 'Varsity Red/White', price: 8999000, stock: 4 },
        { size: '44', color: 'Varsity Red/White', price: 8999000, stock: 3 },
      ],
    },
    {
      name: "Air Max 270 React 'Triple Black'",
      slug: 'air-max-270-react-triple-black',
      description:
        'Boasting the biggest Max Air unit yet, the Air Max 270 delivers unrivaled all-day comfort paired with a bold all-black aesthetic. React foam adds responsive cushioning underfoot.',
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
      name: 'New Balance 550 Cream Burgundy',
      slug: 'new-balance-550-cream-burgundy',
      description:
        'The New Balance 550 is a basketball-inspired court classic reimagined for the streets. Premium leather upper with vintage paneling and understated branding.',
      images: [
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catShoes.id,
      variants: [
        { size: '40', color: 'Cream/Burgundy', price: 4999000, stock: 9 },
        { size: '41', color: 'Cream/Burgundy', price: 4999000, stock: 13 },
        { size: '42', color: 'Cream/Burgundy', price: 4999000, stock: 11 },
        { size: '43', color: 'White/Green', price: 4999000, stock: 7 },
      ],
    },
    // ---- HOODIES -----------------------------------------------------
    {
      name: 'SweetClub Heavyweight Fleece Hoodie',
      slug: 'sweetclub-heavyweight-fleece-hoodie',
      description:
        'Crafted from 450 GSM combed cotton fleece with dropped shoulders and a double-layered hood. Built for extreme comfort and structured oversized drape.',
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
        { size: 'XXL', color: 'Heather Gray', price: 3499000, stock: 8 },
      ],
    },
    {
      name: 'Essential Zip-Up Track Hoodie',
      slug: 'essential-zip-up-track-hoodie',
      description:
        'Lightweight technical jersey hoodie with full zip, ribbed cuffs, and a minimalist tonal design. Ideal for layering or wearing solo.',
      images: [
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catHoodies.id,
      variants: [
        { size: 'S', color: 'Navy Blue', price: 2799000, stock: 12 },
        { size: 'M', color: 'Navy Blue', price: 2799000, stock: 18 },
        { size: 'L', color: 'Slate Gray', price: 2799000, stock: 15 },
        { size: 'XL', color: 'Slate Gray', price: 2799000, stock: 10 },
      ],
    },
    // ---- OUTERWEAR ---------------------------------------------------
    {
      name: 'Tech Fleece Windrunner Jacket',
      slug: 'tech-fleece-windrunner-jacket',
      description:
        'Lightweight warmth meets the classic Windrunner chevron. Premium smooth fleece on both sides keeps you warmer without the bulk. Water-repellent finish.',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catOuterwear.id,
      variants: [
        { size: 'S', color: 'Obsidian Navy', price: 6499000, stock: 6 },
        { size: 'M', color: 'Obsidian Navy', price: 6499000, stock: 9 },
        { size: 'L', color: 'Obsidian Navy', price: 6499000, stock: 7 },
        { size: 'XL', color: 'Smoke Gray', price: 6499000, stock: 5 },
      ],
    },
    {
      name: 'City Runner Packable Shell Jacket',
      slug: 'city-runner-packable-shell-jacket',
      description:
        'Ultralight packable windbreaker with reflective safety strips, mesh back ventilation, and waterproof zip pockets. Packs into its own chest pocket.',
      images: [
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catOuterwear.id,
      variants: [
        { size: 'S', color: 'Neon Lime/Black', price: 4499000, stock: 8 },
        { size: 'M', color: 'Neon Lime/Black', price: 4499000, stock: 12 },
        { size: 'L', color: 'Stealth Gray', price: 4499000, stock: 10 },
        { size: 'XL', color: 'Stealth Gray', price: 4499000, stock: 6 },
      ],
    },
    // ---- MEN ---------------------------------------------------------
    {
      name: 'Essential Athletic Cargo Trousers',
      slug: 'essential-athletic-cargo-trousers',
      description:
        'Relaxed-fit trousers in water-repellent ripstop fabric with adjustable drawcord cuffs, spacious cargo pockets, and a tapered leg for a clean silhouette.',
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catMen.id,
      variants: [
        { size: 'S', color: 'Matte Black', price: 2999000, stock: 10 },
        { size: 'M', color: 'Matte Black', price: 2999000, stock: 16 },
        { size: 'L', color: 'Matte Black', price: 2999000, stock: 22 },
        { size: 'XL', color: 'Olive Green', price: 2999000, stock: 12 },
      ],
    },
    {
      name: 'Oversized Vintage Logo T-Shirt',
      slug: 'oversized-vintage-logo-tee',
      description:
        'Heavyweight 220 GSM organic cotton jersey T-shirt with a pre-washed vintage SweetShop chest print and a structured boxy cut.',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catMen.id,
      variants: [
        { size: 'S', color: 'Off White', price: 1599000, stock: 20 },
        { size: 'M', color: 'Off White', price: 1599000, stock: 25 },
        { size: 'L', color: 'Washed Black', price: 1599000, stock: 18 },
        { size: 'XL', color: 'Washed Black', price: 1599000, stock: 12 },
      ],
    },
    // ---- WOMEN -------------------------------------------------------
    {
      name: "Women's High-Waisted Ribbed Leggings",
      slug: 'women-high-waisted-ribbed-leggings',
      description:
        'Seamless 4-way stretch activewear leggings with a wide high-waist compression band and sweat-wicking quick-dry fabric for high-impact training.',
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catWomen.id,
      variants: [
        { size: 'XS', color: 'Plum Rose', price: 2499000, stock: 10 },
        { size: 'S', color: 'Plum Rose', price: 2499000, stock: 16 },
        { size: 'M', color: 'Charcoal Black', price: 2499000, stock: 22 },
        { size: 'L', color: 'Charcoal Black', price: 2499000, stock: 14 },
      ],
    },
    {
      name: "Women's Oversized Boxy Graphic Tee",
      slug: 'women-oversized-boxy-graphic-tee',
      description:
        'Relaxed crop-cut tee in heavyweight organic cotton with a distressed SweetShop graphic print and raw-edge hem detailing.',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catWomen.id,
      variants: [
        { size: 'XS', color: 'Ecru White', price: 1899000, stock: 12 },
        { size: 'S', color: 'Ecru White', price: 1899000, stock: 18 },
        { size: 'M', color: 'Washed Sage', price: 1899000, stock: 15 },
        { size: 'L', color: 'Washed Sage', price: 1899000, stock: 9 },
      ],
    },
    // ---- ACCESSORIES -------------------------------------------------
    {
      name: 'Heritage Utility Backpack 25L',
      slug: 'heritage-utility-backpack-25l',
      description:
        'Durable 600D polyester backpack with a padded 15" laptop sleeve, water-bottle pocket, and reinforced ergonomic shoulder straps with sternum clip.',
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
      name: 'Pro Training Snapback Cap',
      slug: 'pro-training-snapback-cap',
      description:
        'Structured 6-panel snapback in moisture-wicking Dri-FIT performance fabric with tonal SweetShop embroidery and adjustable rear closure.',
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catAccessories.id,
      variants: [
        { size: 'One Size', color: 'Black', price: 1299000, stock: 40 },
        { size: 'One Size', color: 'White', price: 1299000, stock: 25 },
        { size: 'One Size', color: 'Stone Beige', price: 1299000, stock: 20 },
      ],
    },
    {
      name: 'Performance Crew Socks 3-Pack',
      slug: 'performance-crew-socks-3-pack',
      description:
        'Reinforced heel-and-toe athletic crew socks with arch rib band support and targeted zonal cushioning for high-impact activity.',
      images: [
        'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catAccessories.id,
      variants: [
        { size: 'M (38-42)', color: 'White/Black Multi', price: 899000, stock: 50 },
        { size: 'L (43-46)', color: 'White/Black Multi', price: 899000, stock: 45 },
      ],
    },
  ]

  let created = 0
  let skipped = 0

  for (const { variants, ...productData } of products) {
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } })
    if (existing) {
      skipped++
      continue
    }
    await prisma.product.create({
      data: {
        ...productData,
        variants: { create: variants },
      },
    })
    created++
  }
  console.log(`Products: ${created} created, ${skipped} already existed`)

  // ------------------------------------------------------------------
  // 4. Sample orders for the demo customer (only if they have none yet)
  // ------------------------------------------------------------------
  const existingOrderCount = await prisma.order.count({ where: { userId: customer.id } })

  if (existingOrderCount === 0) {
    const firstVariant = await prisma.productVariant.findFirst({ orderBy: { id: 'asc' } })

    if (firstVariant) {
      await prisma.order.create({
        data: {
          userId: customer.id,
          status: 'PAID',
          total: firstVariant.price,
          deliveryAddress: 'Abay Ave 150, Apt 42, Almaty, Kazakhstan',
          items: {
            create: { variantId: firstVariant.id, quantity: 1, price: firstVariant.price },
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
            create: { variantId: firstVariant.id, quantity: 2, price: firstVariant.price },
          },
        },
      })
      console.log('Created 2 sample orders for the demo customer')
    }
  } else {
    console.log(`Skipped sample orders (customer already has ${existingOrderCount})`)
  }

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log('\nSeeding complete.')
  console.log('  Admin:    admin@sweetshop.kz     / admin123')
  console.log('  Manager:  manager@sweetshop.kz   / manager123')
  console.log('  Customer: customer@sweetshop.kz  / user123')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
