import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const router=Router();
const memoryUsers=new Map();
const registerSchema=z.object({name:z.string().trim().min(2).max(80),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(8).max(72)});
const loginSchema=z.object({email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(8).max(72)});
function tokenFor(user){const secret=process.env.JWT_SECRET;if(!secret)throw new Error('Set JWT_SECRET on the backend before using authentication.');return jwt.sign({sub:String(user.id),email:user.email},secret,{expiresIn:'12h'});}
function publicUser(user){return {id:user.id,name:user.name,email:user.email};}
router.post('/auth/register',async(req,res)=>{const parsed=registerSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({success:false,error:parsed.error.issues[0].message});try{const {name,email,password}=parsed.data;let existing;if(isSupabaseConfigured){const q=await supabase.from('app_users').select('id').eq('email',email).maybeSingle();if(q.error)throw q.error;existing=q.data;}else existing=memoryUsers.get(email);if(existing)return res.status(409).json({success:false,error:'An account with that email already exists.'});const user={id:crypto.randomUUID(),name,email,password_hash:await bcrypt.hash(password,12)};if(isSupabaseConfigured){const q=await supabase.from('app_users').insert(user).select('id,name,email').single();if(q.error)throw q.error;return res.status(201).json({success:true,user:q.data,token:tokenFor(q.data)});}memoryUsers.set(email,user);return res.status(201).json({success:true,user:publicUser(user),token:tokenFor(user)});}catch(err){return res.status(500).json({success:false,error:err.message});}});
router.post('/auth/login',async(req,res)=>{const parsed=loginSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({success:false,error:parsed.error.issues[0].message});try{const {email,password}=parsed.data;let user;if(isSupabaseConfigured){const q=await supabase.from('app_users').select('*').eq('email',email).maybeSingle();if(q.error)throw q.error;user=q.data;}else user=memoryUsers.get(email);if(!user||!await bcrypt.compare(password,user.password_hash))return res.status(401).json({success:false,error:'Email or password is incorrect.'});const safe=publicUser(user);return res.json({success:true,user:safe,token:tokenFor(safe)});}catch(err){return res.status(500).json({success:false,error:err.message});}});
export default router;
