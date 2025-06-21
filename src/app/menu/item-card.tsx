'use client';

import { Card } from 'react-bootstrap';
import { Item } from '@/app/api/data';

type Props = {
  item: Item;
  onClick: (item: Item) => void;
};

export default function ItemCard({ item, onClick }: Props) {
  return (
    <Card
      className="shadow-sm h-100"
      style={{ cursor: 'pointer', maxWidth: '100%' }}
      onClick={() => onClick(item)}
    >
      <Card.Img variant="top" src={item.imagePath} alt={item.name} />
      <Card.Body className='px-1 py-2 text-center'>
        <Card.Title className="fs-card">{item.name}</Card.Title>
        <Card.Text className="text-muted small">{item.description}</Card.Text>
        <Card.Text className="fs-card text-end">¥{item.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}
