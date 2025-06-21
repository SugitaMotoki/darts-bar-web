'use client';

import { useEffect, useState } from 'react';
import { fetchOrders, Order } from '@/app/api/data';
import { Container, ListGroup, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <Container className="mt-3">
      <h4 className="mb-3">📜 注文履歴</h4>

      {orders.length === 0 ? (
        <p className="text-muted">注文履歴がありません。</p>
      ) : (
        <ListGroup>
          {orders.map((order, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-bold">{order.item.name}</div>
                <small className="text-muted">¥{order.item.price}</small>
              </div>
              <Badge bg={order.isProvided ? 'success' : 'secondary'}>
                {order.isProvided ? '提供済み' : '未提供'}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className="text-start mt-4">
        <Link href="/menu" passHref>
          <Button variant="outline-secondary">← メニューに戻る</Button>
        </Link>
      </div>
    </Container>
  );
}
