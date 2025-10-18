import { 
  Train, 
  Droplets, 
  Zap, 
  Building2, 
  Leaf, 
  Briefcase,
  LucideIcon
} from 'lucide-react';

export type SectorType = 'Transportation' | 'Water' | 'Energy' | 'Buildings' | 'Environmental' | 'Internal';

export const sectorIcons: Record<SectorType, LucideIcon> = {
  Transportation: Train,
  Water: Droplets,
  Energy: Zap,
  Buildings: Building2,
  Environmental: Leaf,
  Internal: Briefcase,
};

export function getSectorIcon(sector: SectorType): LucideIcon {
  return sectorIcons[sector] || Briefcase;
}

