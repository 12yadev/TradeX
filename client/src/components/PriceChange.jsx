import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { formatPct, formatSigned, pnlClass } from '../utils/format';

// Green up-arrow for gains, red down-arrow for losses
export default function PriceChange({ percent, amount, showArrow = true }) {
  const cls = pnlClass(percent);
  return (
    <span className={`fw-semibold ${cls}`}>
      {showArrow && percent > 0 && <FiArrowUp size={13} />}
      {showArrow && percent < 0 && <FiArrowDown size={13} />}{' '}
      {amount !== undefined && <>{formatSigned(amount)} </>}
      ({formatPct(percent)})
    </span>
  );
}
