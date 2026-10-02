import { createContext, useContext, useState } from 'react';
import TradeModal from '../components/TradeModal';

const TradeContext = createContext(null);
export const useTrade = () => useContext(TradeContext);

// Lets any page open the Buy/Sell modal and refresh itself after a trade.
// Pages add `refreshKey` to their useFetch deps.
export function TradeProvider({ children }) {
  const [trade, setTrade] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const openTrade = (symbol, side = 'BUY', product = 'LONGTERM') => setTrade({ symbol, side, product });

  return (
    <TradeContext.Provider value={{ openTrade, refreshKey }}>
      {children}
      {trade && (
        <TradeModal
          trade={trade}
          onClose={() => setTrade(null)}
          onSuccess={() => {
            setTrade(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </TradeContext.Provider>
  );
}
