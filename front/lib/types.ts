export interface User {
  id: string 
  email: string   
  passwordHash: string
  role: Role      
  createdAt: string 
  orders: Order[]
  cartItems: CartItem[]
}

export type Role = 'CUSTOMER'| 'ADMIN'

export interface ProductVariant {
  id: string
  size: string
  color: string
  price: number
  stock: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  images: string[]
  isActive: boolean
  categoryId: string
  variants: ProductVariant[]
  createdAt: string
}

export interface  Category {
  id:        string       
  name:      string
  slug:      string  
  parentId:  string | null
  parent:    Category | null  
  children:  Category[] 
  products:  Product[]
}

export interface CartItem {
  id: string
  userId: string
  variantId: string
  quantity: number
  createdAt: string
  variant: ProductVariant & {
    product : Product
  }
}

export interface Order {
  id: string      
  user: User        
  userId: string
  status: OrderStatus 
  total: number
  deliveryAddress: string
  stripePaymentId: string | null
  items: OrderItem[]
  createdAt: string
}


export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIEVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  order: Order
  orderId: string
  variant: ProductVariant
  variantId: string
  quantity: number
  price: number
}