import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/format';

// Responsive price chart. Green when the period ended up, red when down.
export default function StockChart({ data, height = 320 }) {
  const positive = data.length < 2 || data[data.length - 1].price >= data[0].price;
  const color = positive ? '#0f9d58' : '#e53935';
  const gradId = positive ? 'gradUp' : 'gradDown';
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={45} />
        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} width={62} tickFormatter={(v) => v.toLocaleString('en-IN')} />
        <Tooltip formatter={(v) => [formatINR(v), 'Price']} />
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill={`url(#${gradId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
