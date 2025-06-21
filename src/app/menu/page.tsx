'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import {
  fetchLargeCategories,
  fetchSmallCategoriesByLargeCategoryId,
  fetchItemsBySmallCategoryId,
  LargeCategory,
  SmallCategory,
  Item,
  addToCart,
} from '@/app/api/data';
import CategoryTabs from './category-tabs';
import MenuContent from './menu-content';
import Link from 'next/link';

export default function MenuPage() {
  const [largeCategories, setLargeCategories] = useState<LargeCategory[]>([]);
  const [smallCategories, setSmallCategories] = useState<SmallCategory[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedLargeCategoryId, setSelectedLargeCategoryId] = useState<number>(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetchLargeCategories().then(setLargeCategories);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const smalls = await fetchSmallCategoriesByLargeCategoryId(selectedLargeCategoryId);
      setSmallCategories(smalls);

      const allItems = await Promise.all(smalls.map((cat) => fetchItemsBySmallCategoryId(cat.id)));
      setItems(allItems.flat());
    }

    fetchData();
  }, [selectedLargeCategoryId]);

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = async () => {
    if (!selectedItem) return;

    for (let i = 0; i < quantity; i++) {
      await addToCart(selectedItem);
    }

    console.log('カートに追加:', { item: selectedItem, quantity });
    setShowModal(false);
  };

  return (
    <Container fluid className="mt-2">
      <Row>
        <Col xs={3} className="px-1">
          <CategoryTabs
            categories={largeCategories}
            selectedId={selectedLargeCategoryId}
            onSelect={setSelectedLargeCategoryId}
          />
        </Col>
        <Col xs={9}>
          <MenuContent smallCategories={smallCategories} items={items} onSelectItem={handleItemSelect} />
        </Col>
      </Row>

      {/* モーダル */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedItem?.description}</p>
          <p className="text-muted">価格: ¥{selectedItem?.price}</p>
          <Form.Group>
            <Form.Label>数量</Form.Label>
            <Form.Select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            閉じる
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            カートに追加
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '10px',
          zIndex: 999,
        }}
      >
        <div className="d-flex flex-column gap-2">
          <Link href="/cart" passHref>
            <Button variant="primary" className="d-flex align-items-center">
              <i className="bi bi-cart4 me-2"></i>
              カート
            </Button>
          </Link>

          <Link href="/history" passHref>
            <Button variant="secondary" className="d-flex align-items-center">
              <i className="bi bi-clock-history me-2"></i>
              注文履歴
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
