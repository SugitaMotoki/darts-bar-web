'use client';

import { useEffect, useState } from 'react';
import { Item, getCartItems, confirmOrder } from '@/app/api/data';
import { Container, ListGroup, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    getCartItems().then(setCartItems)
  }, []);

  const handleConfirmOrder = async () => {
    await confirmOrder();
    setCartItems([]); // UI上も空に
    setShowMessage(true);
  };

  return (
    <Container className="mt-3">
      <h4 className="mb-3">🛒 カート内容</h4>
      
      {cartItems.length === 0 ? (
        <Alert variant="secondary">カートは空です。</Alert>
      ) : (
        <ListGroup>
          {cartItems.map((item, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold">{item.name}</div>
              </div>
              <small className="text-muted">¥{item.price}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className="mt-4 text-end">
        <Button
          variant="primary"
          onClick={handleConfirmOrder}
          disabled={cartItems.length === 0}
        >
          注文を確定する
        </Button>
      </div>

      {showMessage && (
        <Alert variant="success" className="mt-3">
          注文が確定されました！
        </Alert>
      )}

      <div className="text-start mt-4">
        <Link href="/menu" passHref>
          <Button variant="outline-secondary">
            ← メニューに戻る
          </Button>
        </Link>
      </div>

    </Container>
  );
}
