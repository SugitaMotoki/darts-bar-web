export type LargeCategory = {
  readonly id: number,
  readonly name: string,
}

export type SmallCategory = {
  readonly id: number,
  readonly name: string,
  readonly largeCategoryId: number,
}

export type Item = {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly imagePath: string;
  readonly no: number;
  readonly smallCategoryId: number;
}

export type Order = {
  readonly id: number,
  readonly item: Item,
  isProvided: boolean,
};

export const orders: Order[] = [];

export const cart: Item[] = [];

// LargeCategory
export async function fetchLargeCategories(): Promise<LargeCategory[]> {
  return largeCategories;
}

// SmallCategory
export async function fetchSmallCategories(): Promise<SmallCategory[]> {
  return smallCategories;
}

export async function fetchSmallCategoriesByLargeCategoryId(largeCategoryId: number): Promise<SmallCategory[]> {
  return smallCategories.filter(cat => cat.largeCategoryId === largeCategoryId);
}

// Item
export async function fetchItems(): Promise<Item[]> {
  return items;
}

export async function fetchItemsBySmallCategoryId(smallCategoryId: number): Promise<Item[]> {
  return items.filter(item => item.smallCategoryId === smallCategoryId);
}

export async function addToCart(item: Item) {
  cart.push(item);
}

// すべての注文を取得
export async function fetchOrders(): Promise<Order[]> {
  return orders;
}

// 提供されていない注文のみ取得
export async function fetchUnProvidedOrders(): Promise<Order[]> {
  return orders.filter(order => !order.isProvided);
}

// カートから指定IDの商品を削除（最初に一致したもの1件のみ削除）
export async function removeFromCart(itemId: number) {
  const index = cart.findIndex(item => item.id === itemId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
}

// カート内の全商品を注文に変換し、カートを空にする
export async function confirmOrder() {
  const newOrders: Order[] = cart.map((item, index) => ({
    id: orders.length + index + 1,
    item,
    isProvided: false,
  }));

  orders.push(...newOrders);
  cart.length = 0; // カートを空にする
}

// 指定IDの注文を提供済みにする
export async function provode(itemId: number) {
  const target = orders.find(order => order.item.id === itemId && !order.isProvided);
  if (target) {
    target.isProvided = true;
  }
}

const largeCategories: LargeCategory[] = [
  { id: 1, name: "アルコール" },
  { id: 2, name: "ソフトドリンク" },
  { id: 3, name: "フード" },
  { id: 4, name: "サービス" },
]

const smallCategories: SmallCategory[] = [
  { id: 1, name: "カクテル", largeCategoryId: 1 },
  { id: 2, name: "ジュース", largeCategoryId: 2 },
  { id: 3, name: "コーヒー", largeCategoryId: 2 },
  { id: 4, name: "紅茶", largeCategoryId: 2 },
  { id: 5, name: "ミルク", largeCategoryId: 2 },
  { id: 6, name: "お茶・お水", largeCategoryId: 2 },
  { id: 7, name: "スナック", largeCategoryId: 3 },
  { id: 8, name: "おつまみ", largeCategoryId: 3 },
  { id: 9, name: "テーブル", largeCategoryId: 4 },
]

const items: Item[] = [
  // カクテル (smallCategoryId: 1)
  { id: 1, name: "カシスソーダ", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 1 },
  { id: 2, name: "カシスオレンジ", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 1 },
  { id: 3, name: "カシスマンゴーアップル", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 1 },

  // ジュース (smallCategoryId: 2)
  { id: 4, name: "カルピスウォーター", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 2 },
  { id: 5, name: "カルピスソーダ", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 2 },
  { id: 6, name: "オレンジジュース", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 2 },
  { id: 7, name: "マンゴーアップルジュース", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 2 },

  // コーヒー (smallCategoryId: 3)
  { id: 8, name: "コーヒー（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 3 },
  { id: 9, name: "コーヒー（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 3 },
  { id: 10, name: "カフェラテ（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 3 },
  { id: 11, name: "カフェラテ（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 3 },

  // 紅茶 (smallCategoryId: 4)
  { id: 12, name: "ダージリン（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 4 },
  { id: 13, name: "アールグレイ（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 4 },
  { id: 14, name: "ミルクティー（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 4 },

  // ミルク (smallCategoryId: 5)
  { id: 15, name: "牛乳", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 5 },
  { id: 16, name: "ココア", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 5 },

  // お茶・お水 (smallCategoryId: 6)
  { id: 17, name: "お水", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 6 },
  { id: 18, name: "緑茶（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 6 },
  { id: 19, name: "緑茶（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 6 },
  { id: 20, name: "ほうじ茶（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 6 },
  { id: 21, name: "ほうじ茶（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 5, smallCategoryId: 6 },
  { id: 22, name: "ルイボスティー（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 6, smallCategoryId: 6 },

  // スナック (smallCategoryId: 7)
  { id: 23, name: "ポップコーン", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 7 },
  { id: 24, name: "カントリーマアム", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 7 },
  { id: 25, name: "ポッキー", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 7 },
  { id: 26, name: "ハーベスト", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 7 },

  // おつまみ (smallCategoryId: 8)
  { id: 27, name: "サラミ", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 8 },

  // テーブル (smallCategoryId: 9)
  { id: 28, name: "おしぼり", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 9 },
  { id: 29, name: "ストロー", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 9 },
];
