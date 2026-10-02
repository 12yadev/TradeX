import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import useDebounce from '../hooks/useDebounce';
import { getStocks } from '../services/tradingService';

// Global stock search with a debounced API call
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounced = useDebounce(query.trim(), 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (!debounced) { setResults([]); return; }
    let ignore = false;
    setSearching(true);
    getStocks({ q: debounced, limit: 8 })
      .then((res) => !ignore && setResults(res.stocks))
      .catch(() => !ignore && setResults([]))
      .finally(() => !ignore && setSearching(false));
    return () => { ignore = true; };
  }, [debounced]);

  const go = (symbol) => {
    setQuery(''); setResults([]); setOpen(false);
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div className="search-wrap">
      <div className="input-group input-group-sm">
        <span className="input-group-text bg-white"><FiSearch /></span>
        <input
          className="form-control"
          placeholder="Search stocks (e.g. TCS)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          aria-label="Search stocks"
        />
      </div>
      {open && debounced && (
        <div className="search-results">
          {searching && <div className="p-3 small text-muted">Searching...</div>}
          {!searching && results.length === 0 && <div className="p-3 small text-muted">No stocks match "{debounced}"</div>}
          {results.map((s) => (
            <button key={s.symbol} className="search-item" onMouseDown={() => go(s.symbol)}>
              <strong>{s.symbol}</strong> – {s.companyName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
