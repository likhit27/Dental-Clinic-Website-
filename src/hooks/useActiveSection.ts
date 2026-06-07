import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], offset = 80) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const handleScroll = () => {
      let current = sectionIds[0] ?? '';

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (section && window.scrollY >= section.offsetTop - offset) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset, sectionIds]);

  return activeSection;
}
