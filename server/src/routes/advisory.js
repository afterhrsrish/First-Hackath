import { Router } from 'express';
import { z } from 'zod';
import { supabase, isSupabaseConfigured, inMemoryStore } from '../config/supabase.js';
import { generateCropAdvisory } from '../config/gemini.js';

const router = Router();

const GenerateAdvisorySchema = z.object({
  plot_id: z.string().uuid('Valid Plot UUID required'),
  crop_type: z.string().min(1, 'Crop type is required'),
  growth_stage: z.string().default('Vegetative'),
  query_text: z.string().min(5, 'Query text must be at least 5 characters')
});

/**
 * GET /api/advisories
 * Retrieve all historical advisories
 */
router.get('/advisories', async (req, res) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('advisories')
        .select('*, plots(*, farms(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json({ success: true, data, source: 'supabase' });
    }

    // In-memory fallback
    const enriched = inMemoryStore.advisories.map(adv => {
      const plot = inMemoryStore.plots.find(p => p.id === adv.plot_id);
      const farm = plot ? inMemoryStore.farms.find(f => f.id === plot.farm_id) : null;
      return {
        ...adv,
        plots: plot ? { ...plot, farms: farm } : null
      };
    });

    return res.json({ success: true, data: enriched, source: 'in-memory' });
  } catch (err) {
    console.error('Error fetching advisories:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/advisory/generate
 * Invokes @google/genai and persists advisory to Supabase
 */
router.post('/advisory/generate', async (req, res) => {
  try {
    const parseResult = GenerateAdvisorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.flatten()
      });
    }

    const { plot_id, crop_type, growth_stage, query_text } = parseResult.data;

    // Get farm context if possible
    let farmContext = null;
    if (isSupabaseConfigured && supabase) {
      const { data: plot } = await supabase
        .from('plots')
        .select('*, farms(*)')
        .eq('id', plot_id)
        .single();
      farmContext = plot?.farms;
    } else {
      const plot = inMemoryStore.plots.find(p => p.id === plot_id);
      farmContext = plot ? inMemoryStore.farms.find(f => f.id === plot.farm_id) : null;
    }

    // Call Gemini AI or agricultural intelligence fallback
    const aiResult = await generateCropAdvisory({
      cropType: crop_type,
      growthStage: growth_stage,
      queryText: query_text,
      farmContext
    });

    const advisoryPayload = {
      plot_id,
      query_text,
      condition_diagnosis: aiResult.condition_diagnosis || 'Unspecified Agronomic Anomaly',
      action_plan: aiResult.action_plan || { steps: ['Consult local extension agent'] },
      urgency_level: aiResult.urgency_level || 'MEDIUM'
    };

    let savedRecord = null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('advisories')
        .insert([advisoryPayload])
        .select('*, plots(*, farms(*))')
        .single();

      if (error) {
        console.error('Supabase advisory insert error:', error);
        throw error;
      }
      savedRecord = data;
    } else {
      savedRecord = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...advisoryPayload,
        confidence_score: aiResult.confidence_score,
        summary: aiResult.summary
      };
      inMemoryStore.advisories.unshift(savedRecord);
    }

    return res.status(201).json({
      success: true,
      data: savedRecord,
      ai_meta: {
        confidence_score: aiResult.confidence_score || 0.9,
        summary: aiResult.summary || 'Agronomic AI diagnostic generated'
      }
    });
  } catch (err) {
    console.error('Error in advisory generation:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
