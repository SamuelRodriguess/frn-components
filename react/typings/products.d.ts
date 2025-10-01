export interface Offer {
  AvailableQuantity: number
  Price: number
  ListPrice: number
}

export interface Seller {
  sellerId: string
  commertialOffer: Offer
}

export interface Image {
  cacheId: string
  imageId: string
  imageLabel: string
  imageTag: string
  imageUrl: string
  imageText: string
}

export interface SKU {
  itemId: string
  name: string
  images: Image[]
  sellers: Seller[]
}

export interface Product extends ProductTypes.Product {
  cacheId: string
  productId: string
  productName: string
  linkText: string
  brand: string
  items: SKU[]
}
