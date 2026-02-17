import { Router } from 'express';
import { alphaUniverse, dashboardSnapshot, riskSnapshot } from '../services/simulators.js';

export const terminalRouter = Router();

terminalRouter.get('/dashboard', (_req, res) => res.json(dashboardSnapshot()));
terminalRouter.get('/alpha', (_req, res) => res.json(alphaUniverse()));
terminalRouter.get('/bfp', (_req, res) => {
  const flows = alphaUniverse().map((x) => ({ symbol: x.symbol, bfpScore: x.bfpScore, status: x.bfpScore > 65 ? 'Accumulation' : 'Distribution' }));
  res.json(flows);
});
terminalRouter.get('/risk', (_req, res) => res.json(riskSnapshot()));
terminalRouter.get('/forecast', (_req, res) => {
  res.json({
    horizons: ['3M', '6M', '12M'].map((h) => ({ horizon: h, alphaVsBenchmark: +(Math.random() * 4).toFixed(2), trackingError: +(2 + Math.random() * 4).toFixed(2), ir: +(0.2 + Math.random() * 0.9).toFixed(2) }))
  });
});
