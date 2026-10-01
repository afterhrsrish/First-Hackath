import { Router } from 'express';
import { z } from 'zod';
import { supabase,isSupabaseConfigured,inMemoryStore } from '../config/supabase.js';
import { generateCropAdvisory,isGeminiConfigured } from '../config/gemini.js';

const router=Router();
const schema=z.object({plot_id:z.string().uuid(),crop_type:z.string().min(2).max(80),growth_stage:z.string().min(2).max(80),query_text:z.string().trim().min(15).max(4000)});
router.post('/agent/run',async(req,res)=>{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({success:false,error:parsed.error.issues[0].message});try{const input=parsed.data;
  const plan={id:crypto.randomUUID(),status:'planning',agents:[
    {name:'Workflow planner',role:'Decomposes the field report into an assessment and response',status:'complete',output:'Incident context organized for specialist review.'},
    {name:'Agronomy specialist',role:'Evaluates crop symptoms and proposes next steps',status:'complete'},
    {name:'Risk & operations',role:'Prioritizes actions and prepares a shared checklist',status:'complete'}
  ]};
  const assessment=await generateCropAdvisory({cropType:input.crop_type,growthStage:input.growth_stage,queryText:input.query_text});
  const steps=(assessment.action_plan?.steps||[]).slice(0,5).map((text,index)=>({text,owner:index===0?'Field scout':index===1?'Farm manager':'Agronomy lead',priority:index===0?assessment.urgency_level:'MEDIUM',status:'open'}));
  const actionPlan={...assessment.action_plan,steps:steps.map(s=>s.text),tasks:steps,workflow_id:plan.id};
  const record={plot_id:input.plot_id,query_text:input.query_text,condition_diagnosis:assessment.condition_diagnosis,action_plan:actionPlan,urgency_level:assessment.urgency_level};
  let saved;
  if(isSupabaseConfigured){const q=await supabase.from('advisories').insert(record).select('*').single();if(q.error)throw q.error;saved=q.data;}
  else{saved={id:crypto.randomUUID(),created_at:new Date().toISOString(),...record,summary:assessment.summary,confidence_score:assessment.confidence_score};inMemoryStore.advisories.unshift(saved);}
  plan.status='dispatched';
  plan.agents[1].output=assessment.condition_diagnosis;
  plan.agents[2].output='Risk ranked; '+steps.length+' actions assigned to the field team.';
  return res.status(201).json({success:true,data:{...saved,...assessment,action_plan:actionPlan,workflow:plan,mode:isGeminiConfigured?'gemini':'fallback'}});
}catch(err){console.error('Agent workflow failed:',err);return res.status(500).json({success:false,error:'The agent workflow could not be completed.'});}});
export default router;
