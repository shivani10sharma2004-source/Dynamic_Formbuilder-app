"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function PublicFormViewer() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // User ke answers store karne ke liye
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Signature Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // API se Form Data Fetch karna
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/forms/${formId}`);
        if (!res.ok) {
          throw new Error('Form not found or link is invalid.');
        }
        const data = await res.json();
        
        // Agar form draft mein hai toh error dikhao
        if (!data.active) {
          throw new Error('This form is currently not accepting responses.');
        }

        setForm(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchForm();
  }, [formId]);

  // Handle Input Changes
  const handleInputChange = (fieldId: string, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  // Submit Form Answers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan par hum aage chal kar "Save Response API" call lagayenge
    console.log("User Responses:", responses);
    setIsSubmitted(true);
  };

  // Theme Logic
  const getThemeClasses = (type: 'bg' | 'text' | 'border' | 'lightBg' | 'hover') => {
    const color = form?.theme || 'indigo';
    const themes: any = {
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', lightBg: 'bg-indigo-50/70', hover: 'hover:bg-indigo-700' },
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', lightBg: 'bg-emerald-50/70', hover: 'hover:bg-emerald-700' },
      rose: { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', lightBg: 'bg-rose-50/70', hover: 'hover:bg-rose-700' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', lightBg: 'bg-amber-50/70', hover: 'hover:bg-amber-600' },
      slate: { bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', lightBg: 'bg-slate-100', hover: 'hover:bg-slate-900' }
    };
    return themes[color] ? themes[color][type] : themes.indigo[type];
  };

  // Signature Handlers
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Loading Form...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <span className="text-4xl mb-4 block">🚫</span>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-200 text-center max-w-md w-full">
          <span className="text-5xl mb-4 block text-emerald-500">✅</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
          <p className="text-slate-500 text-sm">Your response has been successfully submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 flex flex-col items-center overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-slate-200 mb-20">
        
        {/* Form Header */}
        <div className={`${getThemeClasses('lightBg')} p-8 rounded-2xl text-center mb-8 border border-slate-200/50`}>
          <h1 className="text-3xl font-extrabold text-slate-900">{form.name}</h1>
          <p className="text-sm text-slate-600 mt-2">{form.description}</p>
        </div>

        {/* Fields rendering */}
        <div className="space-y-6">
          {form.fields.map((field: any, index: number) => {
            const val = responses[field.id] || '';

            return (
              <div key={field.id} className="p-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {index + 1}. {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {/* Text Inputs / Date / Time / Password */}
                {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url' || field.type === 'password' || field.type === 'time' || field.type === 'date') && (
                  <input 
                    type={field.type === 'password' ? 'password' : field.type} 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm" 
                    placeholder={`Enter ${field.label}`} 
                    required={field.required}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea 
                    rows={3} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm" 
                    placeholder={`Enter ${field.label}`} 
                    required={field.required}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                )}

                {field.type === 'dropdown' && (
                  <select 
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm" 
                    required={field.required}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                )}

                {field.type === 'radio' && (
                  <div className="flex flex-col space-y-2">
                    {field.options?.map((opt: string, i: number) => (
                      <label key={i} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition">
                        <input 
                          type="radio" 
                          name={`field-${field.id}`} 
                          className={`w-4 h-4 ${getThemeClasses('text')} bg-white border-slate-300 rounded-full`} 
                          required={field.required}
                          value={opt}
                          checked={val === opt}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                        <span className="text-sm text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'checkbox' && (
                  <div className="flex flex-col space-y-2">
                    {field.options?.map((opt: string, i: number) => (
                      <label key={i} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition">
                        <input 
                          type="checkbox" 
                          className={`w-4 h-4 ${getThemeClasses('text')} bg-white border-slate-300 rounded`} 
                          value={opt}
                          onChange={(e) => {
                            let currentVals = responses[field.id] || [];
                            if (e.target.checked) currentVals = [...currentVals, opt];
                            else currentVals = currentVals.filter((v: string) => v !== opt);
                            handleInputChange(field.id, currentVals);
                          }}
                        />
                        <span className="text-sm text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'rating' && (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1 text-3xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star}
                          onClick={() => handleInputChange(field.id, star)}
                          className={`transition-transform hover:scale-110 ${ (val || 0) >= star ? 'text-amber-400' : 'text-slate-200'}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {field.type === 'range' && (
                  <div className="space-y-1">
                    <input 
                      type="range" min="0" max="100" 
                      value={val || 50}
                      onChange={(e) => handleInputChange(field.id, Number(e.target.value))}
                      className="w-full mt-2 cursor-pointer accent-indigo-600" 
                    />
                    <div className="text-xs font-semibold text-slate-600 text-right">Value: {val || 50}%</div>
                  </div>
                )}

                {field.type === 'signature' && (
                  <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-600">✍️ Draw Signature</span>
                      <button type="button" onClick={clearSignature} className="text-[11px] text-red-600 hover:bg-red-50 px-2 py-1 rounded border border-red-100 font-medium">Clear</button>
                    </div>
                    <canvas 
                      ref={canvasRef} width={500} height={150}
                      onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                      className="w-full h-32 bg-white border border-slate-200 rounded-lg cursor-crosshair touch-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
          
          {form.fields.length > 0 && (
            <div className="pt-8 border-t border-slate-100 mt-8">
              <button type="submit" className={`w-full h-12 ${getThemeClasses('bg')} ${getThemeClasses('hover')} text-white rounded-xl font-bold shadow-md transition`}>
                Submit Form
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}