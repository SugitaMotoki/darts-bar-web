'use server'

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: `./db/darts.db`,
  driver: sqlite3.Database
});


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

// LargeCategory
export async function fetchLargeCategories(): Promise<LargeCategory[]> {
  const db = await dbPromise;
  return db.all(`SELECT * FROM large_categories`);
}

// SmallCategory
export async function fetchSmallCategories(): Promise<SmallCategory[]> {
  const db = await dbPromise;
  return db.all(`SELECT * FROM small_categories`).then(rows => rows.map(toSmallCategory));
}

export async function fetchSmallCategoriesByLargeCategoryId(largeCategoryId: number): Promise<SmallCategory[]> {
  const db = await dbPromise;
  return db.all(`SELECT * FROM small_categories WHERE large_category_id = ?`, largeCategoryId).then(rows => rows.map(toSmallCategory));
}

// Item
export async function fetchItems(): Promise<Item[]> {
  const db = await dbPromise;
  return db.all(`SELECT * FROM items`).then(rows => rows.map(toItem));
}

export async function fetchItemsBySmallCategoryId(smallCategoryId: number): Promise<Item[]> {
  const db = await dbPromise;
  return db.all(`SELECT * FROM items WHERE small_category_id = ?`, smallCategoryId).then(rows => rows.map(toItem));
}

// Cart
export async function addToCart(item: Item) {
  const db = await dbPromise;
  await db.run(`INSERT INTO cart (item_id) VALUES (?)`, item.id);
}

export async function removeFromCart(itemId: number) {
  const db = await dbPromise;
  await db.run(`DELETE FROM cart WHERE item_id = ?`, itemId);
}

export async function getCartItems(): Promise<Item[]> {
  const db = await dbPromise;
  return db.all(`
    SELECT items.* FROM items
    INNER JOIN cart ON cart.item_id = items.id
  `).then(rows => rows.map(toItem));
}

// Orders
export async function fetchOrders(): Promise<Order[]> {
  const db = await dbPromise;
  return db.all(`
    SELECT orders.id, orders.is_provided, items.* FROM orders
    JOIN items ON orders.item_id = items.id
  `).then(rows => rows.map(toOrder));
}

export async function fetchUnProvidedOrders(): Promise<Order[]> {
  const db = await dbPromise;
  return db.all(`
    SELECT orders.id as oid, orders.is_provided, items.* FROM orders
    JOIN items ON orders.item_id = items.id
    WHERE orders.is_provided = 0
  `).then(rows => rows.map(toOrder));
}

export async function confirmOrder() {
  const db = await dbPromise;
  const items: Item[] = await getCartItems();

  await db.run("BEGIN TRANSACTION");
  for (const item of items) {
    await db.run(`INSERT INTO orders (item_id, is_provided) VALUES (?, 0)`, item.id);
  }
  await db.run(`DELETE FROM cart`);
  await db.run("COMMIT");
}

export async function provide(orderId: number) {
  const db = await dbPromise;
  await db.run(`
    UPDATE orders SET is_provided = 1
    WHERE id = ?
  `, orderId);
}

function toSmallCategory(row: any): SmallCategory {
  return {
    id: row.id,
    name: row.name,
    largeCategoryId: row.large_category_id
  }
}

function toItem(row: any): Item {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    imagePath: row.image_path,
    no: row.no,
    smallCategoryId: row.small_category_id,
  }
}

function toOrder(row: any): Order {
  return {
    id: row.oid,
    isProvided: !!row.is_provided,
    item: {
      id: row.item_id,
      name: row.name,
      price: row.price,
      description: row.description,
      imagePath: row.image_path,
      no: row.no,
      smallCategoryId: row.small_category_id,
    }
  };
}

// const items: Item[] = [
//   // カクテル (smallCategoryId: 1)
//   { id: 1, name: "カシスソーダ", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 1 },
//   { id: 2, name: "カシスオレンジ", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 1 },
//   { id: 3, name: "カシスマンゴーアップル", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 1 },

//   // ジュース (smallCategoryId: 2)
//   { id: 4, name: "カルピスウォーター", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 2 },
//   { id: 5, name: "カルピスソーダ", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 2 },
//   { id: 6, name: "オレンジジュース", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 2 },
//   { id: 7, name: "マンゴーアップルジュース", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 2 },

//   // コーヒー (smallCategoryId: 3)
//   { id: 8, name: "コーヒー（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 3 },
//   { id: 9, name: "コーヒー（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 3 },
//   { id: 10, name: "カフェラテ（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 3 },
//   { id: 11, name: "カフェラテ（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 3 },

//   // 紅茶 (smallCategoryId: 4)
//   { id: 12, name: "ダージリン（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 4 },
//   { id: 13, name: "アールグレイ（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 4 },
//   { id: 14, name: "ミルクティー（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 4 },

//   // ミルク (smallCategoryId: 5)
//   { id: 15, name: "牛乳", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 5 },
//   { id: 16, name: "ココア", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 5 },

//   // お茶・お水 (smallCategoryId: 6)
//   { id: 17, name: "お水", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 6 },
//   { id: 18, name: "緑茶（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 6 },
//   { id: 19, name: "緑茶（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 6 },
//   { id: 20, name: "ほうじ茶（アイス）", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 6 },
//   { id: 21, name: "ほうじ茶（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 5, smallCategoryId: 6 },
//   { id: 22, name: "ルイボスティー（ホット）", price: 0, description: "", imagePath: "/default.jpeg", no: 6, smallCategoryId: 6 },

//   // スナック (smallCategoryId: 7)
//   { id: 23, name: "ポップコーン", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 7 },
//   { id: 24, name: "カントリーマアム", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 7 },
//   { id: 25, name: "ポッキー", price: 0, description: "", imagePath: "/default.jpeg", no: 3, smallCategoryId: 7 },
//   { id: 26, name: "ハーベスト", price: 0, description: "", imagePath: "/default.jpeg", no: 4, smallCategoryId: 7 },

//   // おつまみ (smallCategoryId: 8)
//   { id: 27, name: "サラミ", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 8 },

//   // テーブル (smallCategoryId: 9)
//   { id: 28, name: "おしぼり", price: 0, description: "", imagePath: "/default.jpeg", no: 1, smallCategoryId: 9 },
//   { id: 29, name: "ストロー", price: 0, description: "", imagePath: "/default.jpeg", no: 2, smallCategoryId: 9 },
// ];
