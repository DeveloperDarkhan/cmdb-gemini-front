import { useState, useEffect, useRef } from 'react';
import { Search, X, Command, Server, Network, Globe, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useSearch } from '../../contexts/SearchContext';
import './GlobalSearch.css';

interface SearchResult {
  id: string;
  type: 'server' | 'ip' | 'pod' | 'domain' | 'vm' | 'network-device' | 'broker';
  title: string;
  subtitle: string;
  path?: string;
}

const getIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'server': return Server;
    case 'ip': return Network;
    case 'pod': return Box;
    case 'domain': return Globe;
    case 'vm': return Box;
    case 'network-device': return Network;
    case 'broker': return Box;
    default: return Server;
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'server': return 'Server';
    case 'ip': return 'IP Address';
    case 'pod': return 'Kubernetes';
    case 'domain': return 'DNS Record';
    case 'vm': return 'Virtual Machine';
    case 'network-device': return 'Network Device';
    case 'broker': return 'Message Broker';
    default: return 'Asset';
  }
};

export function GlobalSearch() {
  const { isSearchOpen, openSearch, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  // Search logic with debouncing
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/assets?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        
        // Map backend assets to frontend SearchResult format
        const mappedResults: SearchResult[] = data.map((asset: any) => ({
          id: asset.id,
          type: mapBackendTypeToFrontend(asset.type),
          title: asset.name,
          subtitle: `${asset.region} | ${asset.type}`,
          path: getPathForType(asset.type),
        }));

        setResults(mappedResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Clear query when search closes
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Helper to map backend types to frontend icon types
  const mapBackendTypeToFrontend = (type: string): SearchResult['type'] => {
    const lower = type.toLowerCase();
    if (lower.includes('server')) return 'server';
    if (lower.includes('ip')) return 'ip';
    if (lower.includes('kubernetes') || lower.includes('k8s')) return 'pod';
    if (lower.includes('domain')) return 'domain';
    if (lower.includes('vm') || lower.includes('virtual')) return 'vm';
    if (lower.includes('network')) return 'network-device';
    if (lower.includes('dns')) return 'domain';
    if (lower.includes('broker') || lower.includes('message')) return 'broker';
    return 'server'; // default
  };

  // Helper to determine navigation path
  const getPathForType = (type: string): string => {
    const lower = type.toLowerCase();
    if (lower.includes('server')) return '/servers';
    if (lower.includes('k8s')) return '/k8s';
    if (lower.includes('vm') || lower.includes('virtual')) return '/vms';
    if (lower.includes('network')) return '/network-devices';
    if (lower.includes('database')) return '/databases';
    if (lower.includes('dns')) return '/dns';
    if (lower.includes('broker') || lower.includes('message')) return '/brokers';
    return '/datacenters'; // default fallback
  };

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
      // Pass the query as a URL parameter to persist it in the destination page
      navigate(`${result.path}?q=${encodeURIComponent(query)}`);
    }
    closeSearch();
    setQuery('');
  };

  // Отправляем событие для молнии при hover
  const handleMouseEnter = () => {
    window.dispatchEvent(new CustomEvent('search-hover', { detail: { isHovering: true } }));
  };

  const handleMouseLeave = () => {
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

      {/* Search Modal - Portaled to body to ensure it's on top of everything including Sidebar */}
      {createPortal(
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
                    onClick={closeSearch}
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
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}