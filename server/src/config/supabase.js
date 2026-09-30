import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  supabaseUrl.includes('supabase.co') &&
  !supabaseUrl.includes('your-supabase-project')
);

// In-memory fallback database for graceful local testing when credentials are not yet entered
const inMemoryStore = {
  farms: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      created_at: new Date().toISOString(),
      farmer_name: 'Old McDonald',
      farm_name: 'Chaos Acres Organic Ranch',
      location: 'Bakersfield, CA',
      total_area_hectares: 42.5
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      created_at: new Date().toISOString(),
      farmer_name: 'Farmer Giles',
      farm_name: 'Overgrown Pastures & Sons',
      location: 'Des Moines, IA',
      total_area_hectares: 115.0
    }
  ],
  plots: [
    {
      id: '33333333-3333-3333-3333-333333333333',
      created_at: new Date().toISOString(),
      farm_id: '11111111-1111-1111-1111-111111111111',
      plot_name: 'North Corn Hazard Patch',
      crop_type: 'Corn (Maize)',
      growth_stage: 'Tasseling'
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      created_at: new Date().toISOString(),
      farm_id: '11111111-1111-1111-1111-111111111111',
      plot_name: 'West Blight Vineyard',
      crop_type: 'Wine Grapes',
      growth_stage: 'Fruit Set'
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      created_at: new Date().toISOString(),
      farm_id: '22222222-2222-2222-2222-222222222222',
      plot_name: 'Swamp Wheat Quad',
      crop_type: 'Winter Wheat',
      growth_stage: 'Vegetative'
    }
  ],
  advisories: [
    {
      id: '66666666-6666-6666-6666-666666666666',
      created_at: new Date().toISOString(),
      plot_id: '33333333-3333-3333-3333-333333333333',
      query_text: 'Lower leaves show V-shaped yellowing along the midrib.',
      condition_diagnosis: 'Nitrogen Deficiency (Chlorosis)',
      action_plan: {
        steps: [
          'Apply side-dress nitrogen fertilizer at 30-40 lbs/acre',
          'Ensure soil moisture facilitates uptake',
          'Check soil pH to rule out acid-induced nutrient lockup'
        ],
        immediate_threat: 'Yield loss if tasseling finishes without correction'
      },
      urgency_level: 'HIGH'
    }
  ]
};

let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log(' [Supabase] Connected to Supabase Cloud instance:', supabaseUrl);
  } catch (err) {
    console.warn(' [Supabase] Initialization failed, using in-memory store:', err.message);
  }
} else {
  console.log('ℹ️ [Supabase] No valid SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY configured. Running with in-memory fallback store.');
}

export const supabase = supabaseClient;
export { inMemoryStore };
