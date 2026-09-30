import { Router } from 'express';
import { z } from 'zod';
import { supabase, isSupabaseConfigured, inMemoryStore } from '../config/supabase.js';

const router = Router();

// Zod schemas for input validation
const CreateFarmSchema = z.object({
  farmer_name: z.string().min(2, 'Farmer name must be at least 2 characters'),
  farm_name: z.string().min(2, 'Farm name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  total_area_hectares: z.coerce.number().min(0, 'Area must be 0 or greater')
});

const CreatePlotSchema = z.object({
  farm_id: z.string().uuid('Valid farm UUID required'),
  plot_name: z.string().min(2, 'Plot name must be at least 2 characters'),
  crop_type: z.string().min(2, 'Crop type required'),
  growth_stage: z.string().min(2, 'Growth stage required')
});

/**
 * GET /api/farms
 * Retrieve all farms with their plots
 */
router.get('/farms', async (req, res) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: farms, error } = await supabase
        .from('farms')
        .select('*, plots(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      return res.json({ success: true, data: farms, source: 'supabase' });
    }

    // Fallback in-memory
    const farmsWithPlots = inMemoryStore.farms.map(f => ({
      ...f,
      plots: inMemoryStore.plots.filter(p => p.farm_id === f.id)
    }));
    return res.json({ success: true, data: farmsWithPlots, source: 'in-memory' });
  } catch (err) {
    console.error('Error fetching farms:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/farms
 * Create a new farm
 */
router.post('/farms', async (req, res) => {
  try {
    const parseResult = CreateFarmSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.flatten()
      });
    }

    const { farmer_name, farm_name, location, total_area_hectares } = parseResult.data;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('farms')
        .insert([{ farmer_name, farm_name, location, total_area_hectares }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data, source: 'supabase' });
    }

    // In-memory fallback
    const newFarm = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      farmer_name,
      farm_name,
      location,
      total_area_hectares,
      plots: []
    };
    inMemoryStore.farms.unshift(newFarm);
    return res.status(201).json({ success: true, data: newFarm, source: 'in-memory' });
  } catch (err) {
    console.error('Error creating farm:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/plots
 * Retrieve all plots with farm name
 */
router.get('/plots', async (req, res) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: plots, error } = await supabase
        .from('plots')
        .select('*, farms(farm_name, farmer_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json({ success: true, data: plots, source: 'supabase' });
    }

    // Fallback in-memory
    const plotsWithFarms = inMemoryStore.plots.map(p => {
      const farm = inMemoryStore.farms.find(f => f.id === p.farm_id);
      return {
        ...p,
        farms: farm ? { farm_name: farm.farm_name, farmer_name: farm.farmer_name } : null
      };
    });
    return res.json({ success: true, data: plotsWithFarms, source: 'in-memory' });
  } catch (err) {
    console.error('Error fetching plots:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/plots
 * Add a field plot to a farm
 */
router.post('/plots', async (req, res) => {
  try {
    const parseResult = CreatePlotSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.flatten()
      });
    }

    const { farm_id, plot_name, crop_type, growth_stage } = parseResult.data;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('plots')
        .insert([{ farm_id, plot_name, crop_type, growth_stage }])
        .select('*, farms(farm_name, farmer_name)')
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data, source: 'supabase' });
    }

    // In-memory fallback
    const newPlot = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      farm_id,
      plot_name,
      crop_type,
      growth_stage
    };
    inMemoryStore.plots.unshift(newPlot);
    const farm = inMemoryStore.farms.find(f => f.id === farm_id);
    return res.status(201).json({
      success: true,
      data: {
        ...newPlot,
        farms: farm ? { farm_name: farm.farm_name, farmer_name: farm.farmer_name } : null
      },
      source: 'in-memory'
    });
  } catch (err) {
    console.error('Error creating plot:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/farms/:id
 */
router.delete('/farms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('farms').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Farm deleted' });
    }

    inMemoryStore.farms = inMemoryStore.farms.filter(f => f.id !== id);
    inMemoryStore.plots = inMemoryStore.plots.filter(p => p.farm_id !== id);
    return res.json({ success: true, message: 'Farm deleted from in-memory' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
