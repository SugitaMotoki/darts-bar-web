'use client';

import { SmallCategory, Item } from '@/app/api/data';
import ItemCard from './item-card';
import { Row, Col } from 'react-bootstrap';

type Props = {
  smallCategories: SmallCategory[];
  items: Item[];
  onSelectItem: (item: Item) => void;
};

export default function MenuContent({ smallCategories, items, onSelectItem }: Props) {
  return (
    <>
      {smallCategories.map((category) => (
        <div key={category.id} className="mb-4">
          <h6 className="bg-body-secondary px-3 py-2 rounded">{category.name}</h6>
          <Row xs={2}>
            {items
              .filter((item) => item.smallCategoryId === category.id)
              .map((item) => (
                <Col key={item.id} className='my-1'>
                  <ItemCard item={item} onClick={onSelectItem} />
                </Col>
              ))}
          </Row>
        </div>
      ))}
    </>
  );
}
