import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegionSelector.css';

export type Region = 'global' | 'kz' | 'kg' | 'uz' | 'tj';

interface RegionOption {
  value: Region;
  label: string;
  flag?: string;
}

const REGIONS: RegionOption[] = [
  { value: 'global', label: 'Super-Region', flag: '🌍' },
  { value: 'kz', label: 'Kazakhstan', flag: '🇰🇿' },
  { value: 'kg', label: 'Kyrgyzstan', flag: '🇰🇬' },
  { value: 'uz', label: 'Uzbekistan', flag: '🇺🇿' },
  { value: 'tj', label: 'Tajikistan', flag: '🇹🇯' },
];

interface RegionSelectorProps {
  value?: Region;
  onChange?: (region: Region) => void;
}

export function RegionSelector({ value = 'global', onChange }: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRegion = REGIONS.find(r => r.value === selectedRegion) || REGIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (region: Region) => {
    setSelectedRegion(region);
    setIsOpen(false);
    onChange?.(region);
  };

  return (
    <div className="region-selector-wrapper" ref={dropdownRef}>
      <button
        className="region-selector-trigger compact"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="region-selector-trigger"
      >
        {currentRegion.flag && <span className="region-flag">{currentRegion.flag}</span>}
        <span className="region-label-compact">{currentRegion.label}</span>
        <ChevronDown 
          size={14} 
          className={`chevron-icon ${isOpen ? 'open' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="region-dropdown"
          >
            <div className="region-dropdown-header">
              <span>Select Region</span>
            </div>
            <div className="region-options">
              {REGIONS.map((region) => (
                <button
                  key={region.value}
                  className={`region-option ${selectedRegion === region.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(region.value)}
                  data-testid={`region-option-${region.value}`}
                >
                  {region.flag && <span className="option-flag">{region.flag}</span>}
                  <span className="option-label">{region.label}</span>
                  {selectedRegion === region.value && (
                    <Check size={16} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
