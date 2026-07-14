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
  id:        String       
  name:      String
  slug:      String  
  parentId:  String | null
  parent:    Category | null  
  children:  Category[] 
  products:  Product[]
}

