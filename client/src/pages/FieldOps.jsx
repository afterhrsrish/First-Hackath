import React, { useState } from 'react';
import { Activity, ArrowRight, Check, Circle, Leaf, ShieldCheck, Sprout, Users, LoaderCircle } from 'lucide-react';

const demoText='Lower leaves are turning yellow with V-shaped discoloration along the midrib. The block has been wet after several days of rain.';
const agents=[
  {name:'Workflow planner',role:'Plans the response',icon:Activity},
  {name:'Agronomy specialist',role:'Assesses the field signal',icon:Sprout},
  {name:'Risk & operations',role:'Prioritizes and assigns actions',icon:ShieldCheck}
];
export default function FieldOps(){
  const [crop,setCrop]=useState('Corn (Maize)');
  const [stage,setStage]=useState('Vegetative');
  const [observation,setObservation]=useState(demoText);
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');
  const [checked,setChecked]=useState({});
  async function run(e){
    e.preventDefault();setBusy(true);setError('');setResult(null);setChecked({});
    try{
      const response=await fetch('/api/agent/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plot_id:'33333333-3333-3333-3333-333333333333',crop_type:crop,growth_stage:stage,query_text:observation})});
      const data=await response.json();if(!response.ok||!data.success)throw new Error(data.error||'The workflow could not be completed.');
      setResult(data.data);
    }catch(err){setError(err.message+' Make sure the backend is running.');}
    finally{setBusy(false);}
  }
  const steps=result?.action_plan?.steps||[];
  const urgent=result?.urgency_level||'MEDIUM';
  return <div className="fieldops-shell">
    <header className="flex flex-wrap items-center justify-between gap-4 mb-9">
      <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-[#e5f1e8] text-[#34714a] grid place-items-center"><Leaf size={23}/></div><div><div className="font-extrabold text-[18px] tracking-tight" style={{fontFamily:'Manrope'}}>FieldOps AI</div><div className="text-xs text-[#718075]">Farm incident response workspace</div></div></div>
      <div className="flex items-center gap-2 text-xs text-[#52715a] bg-white border border-[#e3e9e2] rounded-full px-3 py-2"><span className="w-2 h-2 rounded-full bg-[#56a76b]"></span> Agent network ready</div>
    </header>
    <section className="mb-8">
      <div className="fieldops-label mb-3">AI operations desk <span className="mx-2 text-[#b0b9b1]">/</span> Field incident</div>
      <h1 className="text-3xl md:text-[40px] leading-tight font-extrabold tracking-[-.04em] max-w-3xl" style={{fontFamily:'Manrope'}}>Turn scattered field signals into coordinated action.</h1>
      <p className="text-[#657368] mt-3 max-w-2xl leading-7">Field teams lose time when observations, decisions, and follow-up tasks live in different places. FieldOps coordinates a plan, specialist assessment, and risk review in one workflow.</p>
    </section>
    <div className="grid lg:grid-cols-[.92fr_1.08fr] gap-5 items-start">
      <form onSubmit={run} className="fieldops-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-5"><div><div className="font-bold text-lg" style={{fontFamily:'Manrope'}}>New field incident</div><div className="text-sm text-[#718075] mt-1">Describe what your team observed.</div></div><span className="text-xs text-[#718075] bg-[#f5f7f3] px-2.5 py-1.5 rounded-lg">Demo plot · North field</span></div>
        <label className="fieldops-label block mb-2">Crop</label><select className="fieldops-input mb-4" value={crop} onChange={e=>setCrop(e.target.value)}><option>Corn (Maize)</option><option>Winter Wheat</option><option>Soybeans</option><option>Wine Grapes</option></select>
        <label className="fieldops-label block mb-2">Growth stage</label><select className="fieldops-input mb-4" value={stage} onChange={e=>setStage(e.target.value)}><option>Vegetative</option><option>Flowering</option><option>Grain Fill</option><option>Harvest</option></select>
        <label className="fieldops-label block mb-2">Field observation</label><textarea className="fieldops-input resize-y min-h-[130px] leading-6" minLength="15" required value={observation} onChange={e=>setObservation(e.target.value)} placeholder="Describe visible symptoms, weather, or other field context."/>
        <div className="flex items-start gap-2 text-xs text-[#77847a] mt-3 leading-5"><ShieldCheck size={15} className="shrink-0 mt-0.5"/> AI guidance supports field decisions. Confirm diagnosis and treatments with a local agronomist and follow product labels.</div>
        {error&&<div role="alert" className="mt-4 rounded-xl bg-[#fff0ec] p-3 text-sm text-[#9a3925]">{error}</div>}
        <button disabled={busy} className="mt-5 w-full rounded-xl bg-[#286640] hover:bg-[#205534] disabled:opacity-60 text-white font-semibold py-3.5 flex justify-center items-center gap-2">{busy?<><LoaderCircle className="animate-spin" size={17}/> Coordinating agents…</>:<>Coordinate response <ArrowRight size={17}/></>}</button>
      </form>
      <div className="space-y-4">
        <div className="fieldops-card p-5 md:p-6">
          <div className="flex items-center justify-between mb-5"><div><div className="font-bold text-lg" style={{fontFamily:'Manrope'}}>Collaborative workflow</div><div className="text-sm text-[#718075] mt-1">Specialists work in sequence, sharing context.</div></div><Users size={20} className="text-[#4c8d66]"/></div>
          <div className="space-y-3">{agents.map((a,i)=>{const Icon=a.icon;return <div key={a.name} className={'flex gap-3 items-center p-3 rounded-xl '+(result?'bg-[#f3f8f3]':'bg-[#f7f8f6]')}><div className="w-9 h-9 rounded-xl bg-white text-[#34714a] grid place-items-center border border-[#e8eee7]"><Icon size={18}/></div><div className="flex-1"><div className="font-semibold text-sm">{a.name}</div><div className="text-xs text-[#718075] mt-0.5">{a.role}</div></div><div className="text-[#4c8d66]">{busy&&i===0?<LoaderCircle size={17} className="animate-spin"/>:result?<Check size={18}/>:<Circle size={17} className="text-[#c4cdc5]"/>}</div></div>})}</div>
          {result&&<div className="mt-4 border-t border-[#edf0eb] pt-4"><div className="fieldops-label mb-2">Shared decision</div><p className="text-sm leading-6 text-[#435248]">{result.summary||result.condition_diagnosis}</p><div className="mt-3 flex items-center gap-2"><span className={'rounded-full px-2.5 py-1 text-xs font-bold '+(urgent==='CRITICAL'?'bg-red-100 text-red-700':urgent==='HIGH'?'bg-orange-100 text-orange-700':'bg-amber-100 text-amber-800')}>{urgent} priority</span><span className="text-xs text-[#718075]">Confidence {Math.round((result.confidence_score||0)*100)}%</span></div></div>}
        </div>
        {result&&<div className="fieldops-card p-5 md:p-6">
          <div className="flex items-start justify-between gap-3 mb-4"><div><div className="font-bold text-lg" style={{fontFamily:'Manrope'}}>Action checklist</div><div className="text-sm text-[#718075] mt-1">Created from the incident assessment</div></div><span className="text-xs text-[#52715a] bg-[#eaf4ec] rounded-full px-2.5 py-1.5">Dispatched</span></div>
          <div className="space-y-2">{steps.map((step,i)=><button type="button" key={i} onClick={()=>setChecked(v=>({...v,[i]:!v[i]}))} className="w-full text-left flex items-start gap-3 p-3 rounded-xl border border-[#edf0eb] hover:bg-[#f8faf7]"><span className={'w-5 h-5 rounded-full shrink-0 grid place-items-center mt-0.5 '+(checked[i]?'bg-[#34714a] text-white':'border border-[#cbd5cb] text-transparent')}>{checked[i]?<Check size={13}/>:<Check size={13}/>}</span><span className={'text-sm leading-6 '+(checked[i]?'line-through text-[#8a968d]':'text-[#37473b]')}>{step}</span></button>)}</div>
          <div className="mt-4 flex justify-between text-xs text-[#718075]"><span>{Object.values(checked).filter(Boolean).length} of {steps.length} actions completed</span><span>Saved to incident history</span></div>
        </div>}
      </div>
    </div>
    <footer className="text-center text-xs text-[#8a968d] mt-10">Built for faster, more consistent farm operations · Powered by Gemini when configured</footer>
  </div>
}
