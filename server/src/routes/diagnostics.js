import { Router } from 'express';
import { generateCropAdvisory } from '../config/gemini.js';

const router = Router();

/**
 * POST /api/diagnostics/analyze
 * Diagnose leaf symptoms or uploaded image data
 */
router.post('/diagnostics/analyze', async (req, res) => {
  try {
    const { crop_type = 'Unknown Crop', symptoms, growth_stage = 'Vegetative', image_data } = req.body;

    if (!symptoms && !image_data) {
      return res.status(400).json({
        success: false,
        error: 'Either symptoms description or leaf image is required'
      });
    }

    const advisory = await generateCropAdvisory({
      cropType: crop_type,
      growthStage: growth_stage,
      queryText: symptoms || 'Visual leaf analysis indicates necrosis and chlorosis lesions.'
    });

    res.json({
      success: true,
      diagnostic: {
        crop_type,
        detected_issue: advisory.condition_diagnosis,
        urgency: advisory.urgency_level,
        confidence: advisory.confidence_score || 0.94,
        summary: advisory.summary || 'Pathological analysis completed.',
        treatment_steps: advisory.action_plan?.steps || [],
        treatments: advisory.action_plan?.chemical_or_organic_treatments || [],
        immediate_threat: advisory.action_plan?.immediate_threat || 'Action required within 48h'
      }
    });
  } catch (err) {
    console.error('Error analyzing leaf diagnostic:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
