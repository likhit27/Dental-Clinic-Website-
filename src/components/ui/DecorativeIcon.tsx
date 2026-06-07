import type { IconName } from '@/data/siteContent';

import {
  ArrowCircleIcon,
  AwardIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  HeartIcon,
  InfoIcon,
  ShieldIcon,
  StarIcon,
} from '../icons/SvgIcons';

interface DecorativeIconProps {
  name: IconName;
  className?: string;
}

export function DecorativeIcon({ name, className }: DecorativeIconProps) {
  switch (name) {
    case 'arrowCircle':
      return <ArrowCircleIcon className={className} />;
    case 'award':
      return <AwardIcon className={className} />;
    case 'check':
      return <CheckCircleIcon className={className} />;
    case 'clock':
      return <ClockIcon className={className} />;
    case 'document':
      return <DocumentIcon className={className} />;
    case 'heart':
      return <HeartIcon className={className} />;
    case 'info':
      return <InfoIcon className={className} />;
    case 'shield':
      return <ShieldIcon className={className} />;
    case 'star':
      return <StarIcon className={className} />;
    default:
      return null;
  }
}
