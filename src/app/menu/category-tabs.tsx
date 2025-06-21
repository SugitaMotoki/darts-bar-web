'use client';

import { LargeCategory } from '@/app/api/data';
import { Nav } from 'react-bootstrap';

type Props = {
  categories: LargeCategory[];
  selectedId: number;
  onSelect: (id: number) => void;
};

export default function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  return (
    <Nav variant="pills" className="flex-column">
      {categories.map((category) => (
        <Nav.Item key={category.id}>
          <Nav.Link
            active={category.id === selectedId}
            onClick={() => onSelect(category.id)}
            className={`fs-menu-tab border rounded mb-2 px-1 text-center ${category.id === selectedId ? 'border-primary' : 'border-secondary-subtle'}`}
            style={{ cursor: 'pointer' }}
          >
            {category.name}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
