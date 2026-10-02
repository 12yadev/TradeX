import api from './api';

const unwrap = (p) => p.then((r) => r.data);

// Auth
export const loginUser = (data) => unwrap(api.post('/auth/login', data));
export const registerUser = (data) => unwrap(api.post('/auth/register', data));
export const fetchMe = () => unwrap(api.get('/auth/me'));

// Stocks
export const getStocks = (params) => unwrap(api.get('/stocks', { params }));
export const getStock = (symbol) => unwrap(api.get(`/stocks/${symbol}`));
export const getHistory = (symbol, period) => unwrap(api.get(`/stocks/${symbol}/history`, { params: { period } }));
export const getIndices = () => unwrap(api.get('/stocks/indices/summary'));

// Watchlist
export const getWatchlist = () => unwrap(api.get('/watchlist'));
export const addToWatchlist = (symbol) => unwrap(api.post('/watchlist', { symbol }));
export const removeFromWatchlist = (symbol) => unwrap(api.delete(`/watchlist/${symbol}`));

// Orders
export const getOrders = (params) => unwrap(api.get('/orders', { params }));
export const placeOrder = (data) => unwrap(api.post('/orders', data));
export const cancelOrder = (id) => unwrap(api.delete(`/orders/${id}`));

// Holdings, positions, portfolio
export const getHoldings = () => unwrap(api.get('/holdings'));
export const getPositions = () => unwrap(api.get('/positions'));
export const getPortfolio = () => unwrap(api.get('/portfolio'));

// Funds
export const getFunds = () => unwrap(api.get('/funds'));
export const addFunds = (amount) => unwrap(api.post('/funds/add', { amount }));
export const withdrawFunds = (amount) => unwrap(api.post('/funds/withdraw', { amount }));
export const getTransactions = () => unwrap(api.get('/transactions'));

// User
export const updateProfile = (data) => unwrap(api.put('/user/profile', data));
export const changePassword = (data) => unwrap(api.put('/user/password', data));
