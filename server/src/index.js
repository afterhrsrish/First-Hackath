import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import farmsRouter from './routes/farms.js';
import advisoryRouter from './routes/advisory.js';
import diagnosticsRouter from './routes/diagnostics.js';
import agentRouter from './routes/agent.js';
import authRouter from './routes/auth.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isGeminiConfigured } from './config/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    services: {
      supabase: {
        configured: isSupabaseConfigured,
        mode: isSupabaseConfigured ? 'cloud_postgresql' : 'in_memory_fallback'
      },
      gemini: {
        configured: isGeminiConfigured,
        mode: isGeminiConfigured ? 'google_genai_live' : 'agronomy_rule_engine'
      }
    },
    message: 'FieldOps Agentic Agriculture Operations API'
  });
});

// Mount Routes
app.use('/api', farmsRouter);
app.use('/api', advisoryRouter);
app.use('/api', diagnosticsRouter);
app.use('/api', agentRouter);
app.use('/api', authRouter);

// Root route
app.get('/', (req, res) => {
  res.send('🌾 Agro-Chaos AI Backend is humming along at high RPM. Visit the frontend for maximum visual disorientation.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found in this field' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Tractor Engine Malfunction' });
});

app.listen(PORT, () => {
  console.log(`🌾 Agro-Chaos Backend running on http://localhost:${PORT}`);
  console.log(`🔌 Supabase configured: ${isSupabaseConfigured}`);
  console.log(`🤖 Gemini configured: ${isGeminiConfigured}`);
});
