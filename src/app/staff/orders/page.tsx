'use client';

import { useEffect, useState } from 'react';
import { fetchUnProvidedOrders, provide, Order } from '@/app/api/data';
import { Container, ListGroup, Button } from 'react-bootstrap';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    const data = await fetchUnProvidedOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleProvide = async (orderId: number) => {
    setLoading(true);
    await provide(orderId);
    console.log(orders)
    await loadOrders();
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-3">未提供の注文一覧</h4>
      {orders.length === 0 ? (
        <p>現在、未提供の注文はありません。</p>
      ) : (
        <ListGroup>
          {orders.map((order, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{order.item.name}</strong>
                <div className="text-muted small">{order.item.description}</div>
                <div className="text-muted small">価格: ¥{order.item.price}</div>
              </div>
              <Button
                variant="success"
                onClick={() => handleProvide(order.id)}
                disabled={loading}
              >
                提供済みにする
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

