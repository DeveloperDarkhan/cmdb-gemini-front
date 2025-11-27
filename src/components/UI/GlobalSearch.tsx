import { useState, useEffect, useRef } from 'react';
import { Search, X, Command, Server, Network, Database, Globe, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import './GlobalSearch.css';

interface SearchResult {
  id: string;
  type: 'server' | 'ip' | 'pod' | 'domain' | 'vm' | 'network-device';
  title: string;
  subtitle: string;
  path?: string;
}

// Mock data - в реальном приложении это будет API запрос
const MOCK_RESULTS: SearchResult[] = [
  { id: '1', type: 'ip', title: '10.10.1.5', subtitle: 'Production Server - Web-01', path: '/servers' },
  { id: '2', type: 'ip', title: '10.10.2.10', subtitle: 'Database Primary', path: '/servers' },
  { id: '3', type: 'server', title: 'web-server-01', subtitle: '10.10.1.5 | DC-East', path: '/servers' },
  { id: '4', type: 'pod', title: 'api-pod-12345', subtitle: 'k8s-prod-cluster', path: '/k8s' },
  { id: '5', type: 'domain', title: 'api.company.com', subtitle: '10.10.3.20', path: '/network-devices' },
  { id: '6', type: 'vm', title: 'vm-analytics-03', subtitle: '10.10.4.15 | Virtual Machine', path: '/vms' },
];

const getIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'server': return Server;
    case 'ip': return Network;
    case 'pod': return Box;
    case 'domain': return Globe;
    case 'vm': return Box;
    case 'network-device': return Network;
    default: return Server;
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'server': return 'Server';
    case 'ip': return 'IP Address';
    case 'pod': return 'K8s Pod';
    case 'domain': return 'Domain';
    case 'vm': return 'Virtual Machine';
    case 'network-device': return 'Network Device';
    default: return 'Asset';
  }
};

export function GlobalSearch() {
  const { isSearchOpen, openSearch, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pulseTimeoutRef = useRef<NodeJS.Timeout>();

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, closeSearch]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Пульсация при скролле sidebar
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // Проверяем что скролл происходит в sidebar nav
      if (target.classList.contains('sidebar-nav') || target.closest('.sidebar-nav')) {
        setShouldPulse(true);
        
        // Очищаем предыдущий timeout
        if (pulseTimeoutRef.current) {
          clearTimeout(pulseTimeoutRef.current);
        }
        
        // Убираем пульсацию через 3 секунды после остановки скролла
        pulseTimeoutRef.current = setTimeout(() => {
          setShouldPulse(false);
        }, 3000);
      }
    };

    // Слушаем скролл на всех элементах с классом sidebar-nav
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
      sidebarNav.addEventListener('scroll', handleScroll);
      return () => {
        sidebarNav.removeEventListener('scroll', handleScroll);
        if (pulseTimeoutRef.current) {
          clearTimeout(pulseTimeoutRef.current);
        }
      };
    }
  }, []);

  // Молния теперь внутри search trigger - не нужна подсветка region selector

  // Search logic
  useEffect(() => {
    if (query.trim()) {
      // В реальном приложении здесь будет API запрос
      const filtered = MOCK_RESULTS.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (result.path) {
      navigate(result.path);
    }
    closeSearch();
    setQuery('');
  };

  // Отправляем событие для молнии при hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    window.dispatchEvent(new CustomEvent('search-hover', { detail: { isHovering: true } }));
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    window.dispatchEvent(new CustomEvent('search-hover', { detail: { isHovering: false } }));
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={openSearch}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`search-trigger ${shouldPulse ? 'pulse' : ''}`}
        data-testid="global-search-trigger"
      >
        <Search size={18} className="search-trigger-icon" />
        <span className="search-trigger-text">Search infrastructure...</span>
        <kbd className="search-trigger-kbd">
          <Command size={12} />
          <span>K</span>
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="global-search-overlay"
            onMouseDown={(e) => {
              // Close only if clicking directly on overlay, not its children
              if (e.target === e.currentTarget) {
                closeSearch();
              }
            }}
            data-testid="global-search-overlay"
          >
            {/* Search Dialog */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="global-search-dialog"
              onMouseDown={(e) => e.stopPropagation()}
              data-testid="global-search-dialog"
            >
              {/* Search Input */}
              <div className="search-input-wrapper">
                <Search size={20} className="search-input-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search servers, IPs, PODs, domains..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="search-input"
                  data-testid="global-search-input"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="search-close-btn"
                  data-testid="global-search-close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Results */}
              <div className="search-results">
                {query && results.length === 0 && (
                  <div className="search-empty">
                    <Search size={48} className="search-empty-icon" />
                    <p className="search-empty-text">No results found for "{query}"</p>
                    <p className="search-empty-hint">Try searching by IP, hostname, or domain</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="search-results-list">
                    {results.map((result, index) => {
                      const Icon = getIcon(result.type);
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result)}
                          className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                          data-testid={`search-result-${index}`}
                        >
                          <div className="search-result-icon">
                            <Icon size={20} />
                          </div>
                          <div className="search-result-content">
                            <div className="search-result-title">{result.title}</div>
                            <div className="search-result-subtitle">{result.subtitle}</div>
                          </div>
                          <div className="search-result-type">{getTypeLabel(result.type)}</div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!query && (
                  <div className="search-hints">
                    <p className="search-hints-title">Search Tips</p>
                    <ul className="search-hints-list">
                      <li>Search by IP address (e.g., "10.10")</li>
                      <li>Find servers by hostname</li>
                      <li>Locate K8s pods by name</li>
                      <li>Discover domains and endpoints</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="search-footer">
                <div className="search-footer-shortcuts">
                  <kbd>↑↓</kbd>
                  <span>Navigate</span>
                  <kbd>Enter</kbd>
                  <span>Select</span>
                  <kbd>Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}