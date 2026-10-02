import WatchlistPanel from '../components/WatchlistPanel';

export default function Watchlist() {
  return (
    <div className="d-flex flex-column gap-3">
      <h4 className="fw-bold mb-0">Watchlist</h4>
      <WatchlistPanel />
    </div>
  );
}
