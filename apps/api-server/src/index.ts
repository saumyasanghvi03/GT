import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { terminalRouter } from './routes/terminal.js';
import { auditTrail } from './middleware/audit.js';
import { authenticate, authorize } from './middleware/auth.js';
import { dashboardSnapshot } from './services/simulators.js';
import { sha256 } from './utils/security.js';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: 'dealer' | 'fund_manager' | 'cio' | 'risk' | 'super_admin' };
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(auditTrail);
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.status(426).json({ error: 'HTTPS required' });
  }
  next();
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const map: Record<string, { hash: string; role: 'dealer' | 'fund_manager' | 'cio' | 'risk' | 'super_admin' }> = {
    dealer1: { hash: sha256('dealer-pass'), role: 'dealer' },
    cio1: { hash: sha256('cio-pass'), role: 'cio' },
    admin: { hash: sha256('admin-pass'), role: 'super_admin' }
  };
  const user = map[username];
  if (!user || user.hash !== sha256(password)) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: username, role: user.role }, process.env.JWT_SECRET ?? 'dev-secret', { expiresIn: '8h' });
  res.json({ token, role: user.role });
});

app.use('/api/terminal', authenticate, terminalRouter);
app.get('/api/compliance/audit', authenticate, authorize(['risk', 'super_admin']), (_req, res) => {
  res.json({ status: 'ok', events: ['cap-breach-check', 'sebi-bucket-monitor', 'rbac-review'] });
});
app.get('/api/health', (_req, res) => res.json({ status: 'healthy', ws: 'enabled', services: 5 }));

const server = createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (socket) => {
  socket.send(JSON.stringify(dashboardSnapshot()));
  const timer = setInterval(() => socket.send(JSON.stringify(dashboardSnapshot())), 3000);
  socket.on('close', () => clearInterval(timer));
});

server.listen(4000, () => console.log('Pramana API on 4000'));
