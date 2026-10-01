import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FieldOps from './pages/FieldOps';

export default function App() {
  return <Routes><Route path="/" element={<FieldOps />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
