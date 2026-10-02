import { Router } from 'express';
import { getPortfolio } from '../controllers/portfolioController.js';

export default Router().get('/', getPortfolio);
