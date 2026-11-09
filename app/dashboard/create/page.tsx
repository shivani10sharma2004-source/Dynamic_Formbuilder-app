"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

interface FormDetails {
  title: string;
  description: string;
  themeColor: string;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[]; 
}

export default function CreateFormPage() {
  const router = useRouter(); 
  
  const [formDetails, setFormDetails] = useState<FormDetails>({
    title: "Student Registration Form",
    description: "Fill in your details below to register.",
    themeColor: "indigo" 
  });

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'field' | 'form' | 'theme'>('form');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [isPublishing, setIsPublishing] = useState(false); 
  const [isDrafting, setIsDrafting] = useState(false); 

  const [previewValues, setPreviewValues] = useState<{ [key: string]: any }>({});

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // ===================== PUBLISH FUNCTION (MODIFIED: Added userEmail) =====================
  const handlePublish = async () => {
    if (formFields.length === 0) {
      alert("Please add at least one field to publish the form.");
      return;
    }

    setIsPublishing(true);

    const formIdGen = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // NAYI LINE: LocalStorage se email uthana taaki form ke sath DB me jaye
    const currentUserEmail = localStorage.getItem('userEmail') || 'guest@example.com';

    const newForm = {
      id: Date.now(),
      formId: formIdGen,
      userEmail: currentUserEmail, // <-- NAYI LINE (MongoDB user linking ke liye)
      name: formDetails.title,
      description: formDetails.description,
      type: 'Custom Form',
      responses: '0 👤',
      updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      active: true,
      status: 'Published', 
      fields: formFields,
      theme: formDetails.themeColor
    };

    try {
      const res = await fetch('http://localhost:5000/api/forms/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm)
      });

      if (res.ok) {
        const existingFormsJSON = localStorage.getItem('formflow_forms');
        let savedForms = [];
        if (existingFormsJSON) {
          savedForms = JSON.parse(existingFormsJSON);
        }

        savedForms.unshift(newForm);
        localStorage.setItem('formflow_forms', JSON.stringify(savedForms));

        setTimeout(() => {
          router.push('/dashboard/forms');
          setIsPublishing(false); 
        }, 800); 
      } else {
        alert("Failed to publish form to database.");
        setIsPublishing(false);
      }
    } catch (error) {
      console.error("Publish Error:", error);
      alert("Server connection failed!");
      setIsPublishing(false);
    }
  };
  // ==================================================================

  // ===================== DRAFT FUNCTION (MODIFIED: Added userEmail) =====================
  const handleDraft = async () => {
    if (formFields.length === 0) {
      alert("Please add at least one field to save as a draft.");
      return;
    }

    setIsDrafting(true);

    const formIdGen = Math.random().toString(36).substr(2, 6).toUpperCase();

    // NAYI LINE: LocalStorage se email uthana
    const currentUserEmail = localStorage.getItem('userEmail') || 'guest@example.com';

    const newForm = {
      id: Date.now(),
      formId: formIdGen,
      userEmail: currentUserEmail, // <-- NAYI LINE (MongoDB user linking ke liye)
      name: formDetails.title,
      description: formDetails.description,
      type: 'Custom Form',
      responses: '0 👤',
      updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      active: false, 
      status: 'Draft', 
      fields: formFields,
      theme: formDetails.themeColor
    };

    try {
      const res = await fetch('http://localhost:5000/api/forms/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm)
      });

      if (res.ok) {
        const existingFormsJSON = localStorage.getItem('formflow_forms');
        let savedForms = [];
        if (existingFormsJSON) {
          savedForms = JSON.parse(existingFormsJSON);
        }

        savedForms.unshift(newForm);
        localStorage.setItem('formflow_forms', JSON.stringify(savedForms));

        setTimeout(() => {
          router.push('/dashboard/forms');
          setIsDrafting(false); 
        }, 800); 
      } else {
        alert("Failed to save draft to database.");
        setIsDrafting(false);
      }
    } catch (error) {
      console.error("Draft Error:", error);
      alert("Server connection failed!");
      setIsDrafting(false);
    }
  };
  // ==================================================================


  const handleAddField = (type: string, defaultLabel: string) => {
    const newField: FormField = {
      id: Math.random().toString(36).substring(7),
      type,
      label: defaultLabel,
      required: false,
      options: (type === 'radio' || type === 'checkbox' || type === 'dropdown') ? ['Option 1', 'Option 2', 'Option 3'] : undefined
    };
    setFormFields([...formFields, newField]);
    setSelectedFieldId(newField.id); 
    setActiveTab('field'); 
  };

  const handleDeleteField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
      setActiveTab('form');
    }
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleUpdateOption = (fieldId: string, index: number, newValue: string) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId && field.options) {
        const newOptions = [...field.options];
        newOptions[index] = newValue;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const handleAddOption = (fieldId: string) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId && field.options) {
        return { ...field, options: [...field.options, `Option ${field.options.length + 1}`] };
      }
      return field;
    }));
  };

  const handleRemoveOption = (fieldId: string, index: number) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId && field.options) {
        const newOptions = field.options.filter((_, i) => i !== index);
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const handleSort = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      let _formFields = [...formFields];
      const draggedItemContent = _formFields.splice(dragItem.current, 1)[0];
      _formFields.splice(dragOverItem.current, 0, draggedItemContent);
      setFormFields(_formFields);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const getThemeClasses = (type: 'bg' | 'text' | 'border' | 'lightBg' | 'hover') => {
    const color = formDetails.themeColor;
    const themes: any = {
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', lightBg: 'bg-indigo-50/70', hover: 'hover:bg-indigo-700' },
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', lightBg: 'bg-emerald-50/70', hover: 'hover:bg-emerald-700' },
      rose: { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', lightBg: 'bg-rose-50/70', hover: 'hover:bg-rose-700' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', lightBg: 'bg-amber-50/70', hover: 'hover:bg-amber-600' },
      slate: { bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', lightBg: 'bg-slate-100', hover: 'hover:bg-slate-900' }
    };
    return themes[color] ? themes[color][type] : themes.indigo[type];
  };

  const selectedField = formFields.find(f => f.id === selectedFieldId);

  // Signature Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Helper for Slider Range Levels
  const getSliderLevelText = (val: number) => {
    if (val <= 25) return "Beginner";
    if (val <= 50) return "Intermediate";
    if (val <= 75) return "Advanced";
    return "Expert / Full";
  };

  // ===================== PREVIEW MODE =====================
  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-slate-100 py-10 flex flex-col items-center overflow-y-auto">
         <div className="w-full max-w-2xl flex justify-between items-center mb-4 px-4">
            <h2 className="text-slate-500 font-medium">👁️ Preview Mode</h2>
            <button onClick={() => setIsPreviewMode(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">
              Exit Preview
            </button>
         </div>
         
         <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-slate-200 mb-20">
            <div className={`${getThemeClasses('lightBg')} p-8 rounded-2xl text-center mb-8 border border-slate-200/50`}>
              <h1 className="text-3xl font-extrabold text-slate-900">{formDetails.title}</h1>
              <p className="text-sm text-slate-600 mt-2">{formDetails.description}</p>
            </div>

            <div className="space-y-6">
              {formFields.map((field, index) => {
                const val = previewValues[field.id] || {};

                return (
                  <div key={field.id} className="p-2">
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      {index + 1}. {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {/* Standard Text Inputs / Date / Time / Password */}
                    {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url' || field.type === 'password' || field.type === 'time' || field.type === 'date') && (
                      <input 
                        type={field.type === 'password' ? 'password' : 'text'} 
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-sm" 
                        placeholder={`Enter ${field.label}`} 
                        required={field.required} 
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-sm" placeholder={`Enter ${field.label}`} required={field.required}></textarea>
                    )}

                    {field.type === 'dropdown' && (
                      <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-sm" required={field.required}>
                        <option value="">Select an option...</option>
                        {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    )}

                    {(field.type === 'radio' || field.type === 'checkbox') && (
                      <div className="flex flex-col space-y-2">
                        {field.options?.map((opt, i) => (
                          <label key={i} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition">
                            <input type={field.type} name={`field-${field.id}`} className={`w-4 h-4 ${getThemeClasses('text')} bg-white border-slate-300 ${field.type === 'radio' ? 'rounded-full' : 'rounded'}`} required={field.type==='radio' ? field.required : false} />
                            <span className="text-sm text-slate-700 font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* WORKING RATING FIELD */}
                    {field.type === 'rating' && (
                       <div className="flex items-center space-x-2">
                          <div className="flex space-x-1 text-3xl cursor-pointer">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star}
                                onClick={() => setPreviewValues({...previewValues, [field.id]: { ...val, rating: star }})}
                                className={`transition-transform hover:scale-110 ${ (val.rating || 0) >= star ? 'text-amber-400' : 'text-slate-200'}`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-500 ml-2">
                            {val.rating ? `${val.rating}/5 Stars` : 'Tap to rate'}
                          </span>
                       </div>
                    )}

                    {/* WORKING SLIDER RANGE WITH LEVEL LABELS */}
                    {field.type === 'range' && (
                      <div className="space-y-1">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          defaultValue="50"
                          onChange={(e) => setPreviewValues({...previewValues, [field.id]: { ...val, slider: Number(e.target.value) }})}
                          className="w-full mt-2 cursor-pointer accent-indigo-600" 
                        />
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                          <span>Value: {val.slider !== undefined ? val.slider : 50}%</span>
                          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            Level: {getSliderLevelText(val.slider !== undefined ? val.slider : 50)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* WORKING SIGNATURE FIELD (PEN / TOUCH) */}
                    {field.type === 'signature' && (
                       <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                               <span>✍️ Draw Signature (Pen/Touch)</span>
                             </span>
                             <button 
                               type="button" 
                               onClick={clearSignature} 
                               className="text-[11px] text-red-600 hover:bg-red-50 px-2 py-1 rounded border border-red-100 font-medium transition"
                             >
                               Clear
                             </button>
                          </div>
                          <canvas 
                            ref={canvasRef}
                            width={500}
                            height={150}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-32 bg-white border border-slate-200 rounded-lg cursor-crosshair shadow-inner touch-none"
                          />
                       </div>
                    )}

                    {/* STRICT IMAGE UPLOAD (Only Images) */}
                    {field.type === 'image-upload' && (
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:border-indigo-400 transition cursor-pointer relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if(e.target.files && e.target.files[0]) {
                              setPreviewValues({...previewValues, [field.id]: { ...val, imageName: e.target.files[0].name }});
                            }
                          }}
                        />
                        <span className="text-2xl block mb-1">🖼️</span>
                        <p className="text-xs font-bold text-slate-700">
                          {val.imageName ? `Selected: ${val.imageName}` : 'Drag & drop image here or click to browse'}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">(Only image files are accepted)</span>
                      </div>
                    )}

                    {/* MULTIPLE FILE UPLOAD */}
                    {field.type === 'file-multiple' && (
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:border-indigo-400 transition cursor-pointer relative">
                        <input 
                          type="file" 
                          multiple 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if(e.target.files) {
                              setPreviewValues({...previewValues, [field.id]: { ...val, fileCount: e.target.files.length }});
                            }
                          }}
                        />
                        <span className="text-2xl block mb-1">📂</span>
                        <p className="text-xs font-bold text-slate-700">
                          {val.fileCount ? `${val.fileCount} file(s) selected` : 'Drag & drop files here or click to browse'}
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}
              
              {formFields.length > 0 && (
                <div className="pt-8 border-t border-slate-100 mt-8">
                  <button className={`w-full h-12 ${getThemeClasses('bg')} ${getThemeClasses('hover')} text-white rounded-xl font-bold shadow-md transition flex items-center justify-center space-x-2`}>
                    <span>Submit Form</span>
                  </button>
                </div>
              )}
            </div>
         </div>
      </div>
    );
  }

  // ===================== BUILDER MODE =====================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`text-white text-xs font-bold px-2 py-1.5 rounded-md ${getThemeClasses('bg')}`}>FF</div>
            <span className="font-bold text-slate-900 text-sm">FormFlow</span>
          </div>
          <div className="h-5 w-[1px] bg-slate-200"></div>
          <Link href="/dashboard/forms" className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1 transition">
            <span>&larr; Back to My Forms</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveTab('form')} className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 flex items-center space-x-2 border border-slate-200 hover:bg-slate-200 transition cursor-pointer">
            <span>✏️</span><span className="truncate max-w-[150px]">{formDetails.title}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsPreviewMode(true)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition">👁️ Preview</button>
          
          {/* DRAFT BUTTON WORKING */}
          <button 
            onClick={handleDraft}
            disabled={isDrafting}
            className={`px-4 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium shadow-sm transition flex items-center space-x-1 ${isDrafting ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isDrafting ? (
              <>
                <span className="animate-spin text-sm mr-1">⏳</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="mr-1">💾</span>
                <span>Save Draft</span>
              </>
            )}
          </button>

          {/* PUBLISH BUTTON WORKING */}
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-4 py-2 text-white rounded-xl text-xs font-medium shadow-md transition flex items-center space-x-1 ${getThemeClasses('bg')} ${getThemeClasses('hover')} ${isPublishing ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isPublishing ? (
              <>
                <span className="animate-spin text-sm mr-1">⏳</span>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span className="mr-1">🚀</span>
                <span>Publish Form</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR: Add Fields */}
        <aside className="w-64 bg-white border-r border-slate-200 p-5 overflow-y-auto hidden lg:block shrink-0 custom-scrollbar">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Add Fields</h3>
          <div className="space-y-6 text-xs text-slate-600">
            
            {/* BASIC FIELDS */}
            <div>
              <div className="font-semibold text-slate-400 mb-2 uppercase text-[10px]">Basic</div>
              <div className="space-y-1.5">
                <div onClick={() => handleAddField('text', 'Name')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>👤</span><span className="font-medium">Name</span>
                </div>
                <div onClick={() => handleAddField('email', 'Email Address')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>📧</span><span className="font-medium">Email</span>
                </div>
                <div onClick={() => handleAddField('tel', 'Phone Number')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>📞</span><span className="font-medium">Phone Number</span>
                </div>
              </div>
            </div>

            {/* CHOICE FIELDS */}
            <div>
              <div className="font-semibold text-slate-400 mb-2 uppercase text-[10px]">Choices</div>
              <div className="space-y-1.5">
                <div onClick={() => handleAddField('dropdown', 'Dropdown Selection')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>▼</span><span className="font-medium">Dropdown</span>
                </div>
                <div onClick={() => handleAddField('checkbox', 'Multiple Choices')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>☑️</span><span className="font-medium">Checkboxes</span>
                </div>
                <div onClick={() => handleAddField('radio', 'Single Choice')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>🔘</span><span className="font-medium">Radio Button</span>
                </div>
              </div>
            </div>
            
            {/* OTHER FIELDS */}
             <div>
              <div className="font-semibold text-slate-400 mb-2 uppercase text-[10px]">Other</div>
              <div className="space-y-1.5">
                <div onClick={() => handleAddField('date', 'Date')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>📅</span><span className="font-medium">Date</span>
                </div>
                <div onClick={() => handleAddField('time', 'Time')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>⏰</span><span className="font-medium">Time</span>
                </div>
                <div onClick={() => handleAddField('url', 'Website URL')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>🔗</span><span className="font-medium">URL / Website</span>
                </div>
                <div onClick={() => handleAddField('password', 'Password')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>🔑</span><span className="font-medium">Password</span>
                </div>
                <div onClick={() => handleAddField('textarea', 'Address')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>📍</span><span className="font-medium">Address</span>
                </div>
                <div onClick={() => handleAddField('rating', 'Rating')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>⭐</span><span className="font-medium">Rating</span>
                </div>
                <div onClick={() => handleAddField('range', 'Slider / Range')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>🎚️</span><span className="font-medium">Slider / Range</span>
                </div>
                <div onClick={() => handleAddField('signature', 'Signature')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>✍️</span><span className="font-medium">Signature</span>
                </div>
                
                {/* STRICT IMAGE UPLOAD (Color picker removed) */}
                <div onClick={() => handleAddField('image-upload', 'Image Upload')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>🖼️</span><span className="font-medium">Image Upload</span>
                </div>
                
                {/* RENAMED MULTIPLE FILE UPLOAD */}
                 <div onClick={() => handleAddField('file-multiple', 'File Upload')} className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl border border-slate-100 cursor-pointer flex items-center space-x-2.5 transition">
                  <span>📂</span><span className="font-medium">File Upload</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER CANVAS: Form Builder Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-100/60 flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-slate-200/80 p-8 min-h-[500px]">
            
            <div 
              onClick={() => { setSelectedFieldId(null); setActiveTab('form'); }}
              className={`${getThemeClasses('lightBg')} p-6 rounded-2xl border text-center mb-8 relative cursor-pointer transition ${activeTab === 'form' ? 'border-slate-400 shadow-md ring-2 ring-slate-200' : 'border-transparent hover:border-slate-300'}`}
            >
              <div className={`w-10 h-10 text-white rounded-xl mx-auto flex items-center justify-center font-bold mb-2 shadow-sm ${getThemeClasses('bg')}`}>📋</div>
              <h2 className="text-xl font-extrabold text-slate-900">{formDetails.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{formDetails.description}</p>
              {activeTab === 'form' && <span className="absolute top-2 right-2 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded font-medium">Editing Title</span>}
            </div>

            {formFields.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center bg-slate-50/50">
                <span className="text-4xl mb-2">👈</span>
                <p>Click fields on the left panel to add them here.</p>
              </div>
            ) : (
              <div className="space-y-4 pb-20">
                {formFields.map((field, index) => {
                  const isSelected = selectedFieldId === field.id;
                  
                  return (
                    <div 
                      key={field.id}
                      draggable
                      onDragStart={() => (dragItem.current = index)}
                      onDragEnter={() => (dragOverItem.current = index)}
                      onDragEnd={handleSort}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); setActiveTab('field'); }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all flex group relative ${isSelected ? `border-2 ${getThemeClasses('border')} bg-slate-50` : 'border border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className="pr-3 text-slate-300 group-hover:text-slate-400 cursor-grab flex flex-col justify-center">
                        <span className="text-lg leading-none">⋮⋮</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2 pointer-events-none">
                          <label className="text-xs font-bold text-slate-800">
                            {index + 1}. {field.label} {field.required && '*'}
                          </label>
                        </div>
                        
                        <div className="opacity-60 pointer-events-none">
                          {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url' || field.type === 'password' || field.type === 'time' || field.type === 'date') && (
                            <input type={field.type === 'password' ? 'password' : 'text'} placeholder={`Enter ${field.label}...`} disabled className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs" />
                          )}
                           {field.type === 'textarea' && (
                            <textarea disabled rows={2} placeholder="..." className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs"></textarea>
                          )}
                          {field.type === 'dropdown' && (
                            <select disabled className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
                              <option>{field.options?.[0] || 'Select option...'}</option>
                            </select>
                          )}
                          {(field.type === 'radio' || field.type === 'checkbox') && (
                            <div className="flex flex-col space-y-2 mt-2 text-xs">
                              {field.options?.map((opt, i) => (
                                <label key={i} className="flex items-center space-x-2">
                                  <input type={field.type} disabled className={`w-3.5 h-3.5 bg-slate-200 border-slate-300 ${field.type === 'radio' ? 'rounded-full' : 'rounded'}`} />
                                  <span className="font-medium text-slate-600">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {field.type === 'rating' && <div className="text-slate-300 text-lg">⭐⭐⭐⭐⭐</div>}
                          {field.type === 'range' && <input type="range" disabled className="w-full mt-2" />}
                          
                          {field.type === 'signature' && (
                             <div className="w-full h-20 border border-slate-300 border-dashed rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                               ✍️ Signature Pad Preview
                             </div>
                          )}

                          {field.type === 'image-upload' && (
                            <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500 bg-slate-50">🖼️ Image Upload Box (Only Images)</div>
                          )}

                          {field.type === 'file-multiple' && (
                            <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500 bg-slate-50">📂 File Upload Box</div>
                          )}
                        </div>
                      </div>

                      {/* SVG DUSTBIN ICON */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteField(field.id);
                        }}
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 bg-white border border-red-200 hover:bg-red-50 text-red-500 p-1.5 rounded-lg z-10 shadow-sm flex items-center justify-center cursor-pointer"
                        title="Delete Field"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: Multi-Tab Settings */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden xl:flex shrink-0">
          
          <div className="flex border-b border-slate-200 p-2 space-x-1 shrink-0 bg-slate-50">
             <button onClick={() => { setActiveTab('form'); setSelectedFieldId(null); }} className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'form' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}>Form Info</button>
             <button onClick={() => { setActiveTab('field'); }} className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'field' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}>Field Edit</button>
             <button onClick={() => { setActiveTab('theme'); setSelectedFieldId(null); }} className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'theme' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}>Design</button>
          </div>

          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            
            {activeTab === 'form' && (
              <div className="space-y-5 text-xs animate-fadeIn">
                <h3 className="font-bold text-slate-800 border-b pb-2">Form Details</h3>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1.5">Form Title</label>
                  <input type="text" value={formDetails.title} onChange={(e) => setFormDetails({...formDetails, title: e.target.value})} className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1.5">Description (Optional)</label>
                  <textarea rows={4} value={formDetails.description} onChange={(e) => setFormDetails({...formDetails, description: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"></textarea>
                </div>
              </div>
            )}

            {activeTab === 'field' && (
               selectedField ? (
                <div className="space-y-5 text-xs animate-fadeIn">
                   <h3 className="font-bold text-slate-800 border-b pb-2 flex justify-between items-center">
                      <span>Edit Field</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{selectedField.type}</span>
                   </h3>
                   
                   <div>
                    <label className="block font-semibold text-slate-600 mb-1.5">Question Label</label>
                    <input 
                      type="text" 
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
    
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-semibold text-slate-700">Make this field Required?</span>
                    <input 
                      type="checkbox" 
                      checked={selectedField.required}
                      onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                    />
                  </div>

                  {selectedField.options && (
                    <div className="pt-4 border-t border-slate-100 mt-4">
                      <label className="block font-semibold text-slate-800 mb-3">Choice Options</label>
                      <div className="space-y-2.5">
                        {selectedField.options.map((opt, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="flex-1 relative">
                              <input 
                                type="text" 
                                value={opt}
                                onChange={(e) => handleUpdateOption(selectedField.id, i, e.target.value)}
                                className="w-full h-9 pl-3 pr-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                              />
                            </div>
                            {selectedField.options!.length > 1 && (
                              <button onClick={() => handleRemoveOption(selectedField.id, i)} className="p-2 text-slate-400 hover:text-red-500 transition rounded-md hover:bg-red-50">
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleAddOption(selectedField.id)} className="mt-3 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 p-1 rounded hover:bg-indigo-50 transition">
                        <span>+</span><span>Add Option</span>
                      </button>
                    </div>
                  )}
    
                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <button onClick={() => handleDeleteField(selectedField.id)} className="w-full h-10 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold transition flex items-center justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <span>Remove Field</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 mt-10">
                  <span className="text-3xl block mb-3">🖱️</span>
                  <p>Select a field from the center canvas to edit its properties here.</p>
                </div>
              )
            )}

            {activeTab === 'theme' && (
              <div className="space-y-6 text-xs animate-fadeIn">
                <h3 className="font-bold text-slate-800 border-b pb-2">Appearance</h3>
                
                <div>
                  <label className="block font-semibold text-slate-600 mb-3">Form Color Theme</label>
                  <div className="grid grid-cols-5 gap-3">
                     {[
                       { id: 'indigo', hex: 'bg-indigo-600' },
                       { id: 'emerald', hex: 'bg-emerald-600' },
                       { id: 'rose', hex: 'bg-rose-600' },
                       { id: 'amber', hex: 'bg-amber-500' },
                       { id: 'slate', hex: 'bg-slate-800' },
                     ].map(color => (
                       <button
                         key={color.id}
                         onClick={() => setFormDetails({...formDetails, themeColor: color.id})}
                         className={`h-10 w-full rounded-lg ${color.hex} flex items-center justify-center transition-all ${formDetails.themeColor === color.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-md' : 'opacity-80 hover:opacity-100'}`}
                       >
                         {formDetails.themeColor === color.id && <span className="text-white text-xs font-bold">✓</span>}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-6 relative overflow-hidden">
                   <div className="absolute -right-2 -bottom-2 text-4xl opacity-20">🤖</div>
                   <h4 className="font-bold text-blue-800 mb-1 flex items-center space-x-1">
                     <span>✨ AI Suggestion</span>
                   </h4>
                   <p className="text-[11px] text-blue-700 leading-relaxed mb-3">
                     Based on the title <strong>"{formDetails.title}"</strong>, we suggest an Academic theme.
                   </p>
                   <button onClick={() => setFormDetails({...formDetails, themeColor: 'indigo'})} className="bg-white text-blue-700 font-bold px-3 py-1.5 rounded-md shadow-sm border border-blue-200 hover:bg-blue-100 transition">
                     Apply Academic Theme (Indigo)
                   </button>
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}