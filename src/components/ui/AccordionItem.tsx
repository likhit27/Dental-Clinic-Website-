import clsx from 'clsx';
import { useRef } from 'react';

interface AccordionItemProps {
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  question: string;
}

export function AccordionItem({ answer, isOpen, onToggle, question }: AccordionItemProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="accordion-item">
      <button
        type="button"
        className={clsx('accordion-btn', isOpen && 'active')}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {question} <span className="icon">+</span>
      </button>
      <div
        className="accordion-panel"
        ref={panelRef}
        style={{ maxHeight: isOpen ? `${panelRef.current?.scrollHeight ?? 0}px` : undefined }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}
