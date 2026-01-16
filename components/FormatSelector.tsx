
import React, { useState } from 'react';
import { Layers, AlertCircle, TrendingUp, Zap, User, UserCheck, ShieldCheck, Star, PenTool } from 'lucide-react';
import { CreativeFormat, AdIdentity } from '../types';

interface FormatSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFormats: Set<CreativeFormat>;
  onSelectFormat: (fmt: CreativeFormat) => void;
  onConfirm: (identity: AdIdentity | null) => void; // Updated signature
  formatGroups: Record<string, CreativeFormat[]>;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ isOpen, onClose, selectedFormats, onSelectFormat, onConfirm, formatGroups }) => {
    const [selectedIdentity, setSelectedIdentity] = useState<AdIdentity | null>(null);
    
    if (!isOpen) return null;
    
    // Helper to get icon for identity
    const getIdentityIcon = (id: AdIdentity) => {
        switch(id) {
            case AdIdentity.AUTHORITY: return <ShieldCheck className="w-4 h-4"/>;
            case AdIdentity.SKEPTIC: return <UserCheck className="w-4 h-4"/>;
            case AdIdentity.INFLUENCER: return <Star className="w-4 h-4"/>;
            case AdIdentity.DIARIST: return <PenTool className="w-4 h-4"/>;
            case AdIdentity.OBSERVER: return <User className="w-4 h-4"/>;
            default: return <User className="w-4 h-4"/>;
        }
    };

    const getIdentityDesc = (id: AdIdentity) => {
        switch(id) {
            case AdIdentity.AUTHORITY: return "High trust. Uses data & facts. 'As a specialist...'";
            case AdIdentity.SKEPTIC: return "High relatability. Overcomes objections. 'I didn't believe it...'";
            case AdIdentity.INFLUENCER: return "High curiosity. Secret sharing. 'Don't walk, RUN.'";
            case AdIdentity.DIARIST: return "High emotion. Vulnerable & raw. 'I'm shaking writing this...'";
            case AdIdentity.OBSERVER: return "Social proof. Third-party analysis. 'Look at her results...'";
            default: return "";
        }
    };
    
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
              <div className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  
                  {/* HEADER */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                          <h2 className="text-xl font-display font-bold text-slate-900">Select Creative Formats</h2>
                          <p className="text-sm text-slate-500">Choose visuals and define the voice.</p>
                      </div>
                      <div className="flex gap-3">
                          <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg font-bold text-sm">Cancel</button>
                          <button 
                            onClick={() => onConfirm(selectedIdentity)} 
                            disabled={selectedFormats.size === 0} 
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4 fill-white" />
                            Generate {selectedFormats.size} Creatives
                          </button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-slate-50/50">
                      <div className="p-8 space-y-8">
                          
                          {/* SECTION 1: VOICE / POV SELECTION (NEW) */}
                          <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                  <User className="w-4 h-4" /> Step 1: Who is speaking? (Voice Archetype)
                              </h3>
                              <div className="grid grid-cols-5 gap-4">
                                  {Object.values(AdIdentity).map((identity) => (
                                      <button
                                          key={identity}
                                          onClick={() => setSelectedIdentity(selectedIdentity === identity ? null : identity)}
                                          className={`relative p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 h-full ${
                                              selectedIdentity === identity 
                                              ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
                                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                                          }`}
                                      >
                                          {selectedIdentity === identity && (
                                              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></div>
                                          )}
                                          <div className={`p-2 rounded-lg w-fit ${selectedIdentity === identity ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                              {getIdentityIcon(identity)}
                                          </div>
                                          <div>
                                              <div className="font-bold text-xs text-slate-900 mb-1 leading-tight">{identity}</div>
                                              <div className="text-[10px] text-slate-500 leading-snug">{getIdentityDesc(identity)}</div>
                                          </div>
                                      </button>
                                  ))}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 italic">*Leave unselected to let AI determine the best voice for each format automatically.</p>
                          </div>

                          <div className="w-full h-px bg-slate-200"></div>

                          {/* SECTION 2: FORMAT SELECTION */}
                          <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                  <Layers className="w-4 h-4" /> Step 2: Choose Visual Formats
                              </h3>
                              <div className="grid grid-cols-3 gap-6">
                                  {Object.entries(formatGroups).map(([group, formats]) => {
                                      // Style Logic based on Group Name
                                      let headerStyle = "text-slate-500";
                                      let bgStyle = "bg-white";
                                      let borderStyle = "border-slate-200";
                                      let icon = <Layers className="w-4 h-4"/>;
                                      let desc = "";

                                      if (group.includes("🔵")) { 
                                          headerStyle = "text-blue-600"; 
                                          bgStyle = "bg-blue-50/30"; 
                                          borderStyle = "border-blue-100";
                                          icon = <Zap className="w-4 h-4"/>;
                                          desc = "Target 60% Unaware. Stop scroll. Viral & Relatable.";
                                      }
                                      else if (group.includes("🟠")) { 
                                          headerStyle = "text-orange-600"; 
                                          bgStyle = "bg-orange-50/30"; 
                                          borderStyle = "border-orange-100";
                                          icon = <AlertCircle className="w-4 h-4"/>;
                                          desc = "Target 20% Problem Aware. Educate & Build Trust.";
                                      }
                                      else if (group.includes("🔴")) { 
                                          headerStyle = "text-red-600"; 
                                          bgStyle = "bg-red-50/30"; 
                                          borderStyle = "border-red-100";
                                          icon = <TrendingUp className="w-4 h-4"/>;
                                          desc = "Target 3% Ready to Buy. Hard Offer & Scarcity.";
                                      }

                                      return (
                                        <div key={group} className={`p-5 rounded-xl border shadow-sm flex flex-col h-full ${bgStyle} ${borderStyle}`}>
                                            <div className="mb-4">
                                                <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${headerStyle}`}>
                                                {icon} {group}
                                                </h3>
                                                <p className="text-[10px] text-slate-500 mt-1 italic">{desc}</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 flex-1 content-start">
                                                {(formats as CreativeFormat[]).map(fmt => (
                                                    <button 
                                                        key={fmt} 
                                                        onClick={() => onSelectFormat(fmt)} 
                                                        className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                                                            selectedFormats.has(fmt) 
                                                            ? 'bg-white border-blue-500 text-blue-700 shadow-md ring-1 ring-blue-200' 
                                                            : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200 text-slate-600'
                                                        }`}
                                                    >
                                                        {fmt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
    );
}

export default FormatSelector;
