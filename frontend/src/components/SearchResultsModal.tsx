import React from 'react';
import { X, Search, Building2, User, Wallet, Briefcase, Globe } from 'lucide-react';

interface SearchResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    query: string;
    results: {
        founders: string[];
        investors: string[];
    };
    isSearching: boolean;
}

export function SearchResultsModal({ isOpen, onClose, query, results, isSearching }: SearchResultsModalProps) {
    if (!isOpen) return null;

    // content parser helper
    const parseContent = (text: string) => {
        // Simple key-value extraction for display
        // e.g. "Company: Acme. Founder: John." -> { Company: "Acme", Founder: "John" }
        const parts = text.split('.').filter(p => p.trim().length > 0);
        return parts.map(p => {
            const [key, ...val] = p.split(':');
            return { key: key.trim(), value: val.join(':').trim() };
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
                            <p className="text-sm text-gray-500">Showing results for <span className="font-semibold text-gray-800">"{query}"</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">

                    {isSearching ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="animate-pulse font-medium">Analyzing database...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Founders Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-5 h-5 text-indigo-600" />
                                    <h3 className="text-lg font-bold text-slate-800">Founders & Companies</h3>
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{results.founders.length}</span>
                                </div>

                                {results.founders.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No matching founders found.</p>
                                ) : (
                                    results.founders.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                                            <div className="space-y-2">
                                                {parseContent(item).map((kv, kqvIdx) => (
                                                    <div key={kqvIdx} className="flex flex-col">
                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{kv.key}</span>
                                                        <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">{kv.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Investors Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wallet className="w-5 h-5 text-emerald-600" />
                                    <h3 className="text-lg font-bold text-slate-800">Investors & VCs</h3>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{results.investors.length}</span>
                                </div>

                                {results.investors.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No matching investors found.</p>
                                ) : (
                                    results.investors.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-emerald-100 group">
                                            <div className="space-y-2">
                                                {parseContent(item).map((kv, kqvIdx) => (
                                                    <div key={kqvIdx} className="flex flex-col">
                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{kv.key}</span>
                                                        <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">{kv.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                    <Search className="w-3 h-3" />
                    <span>AI-Powered RAG Search • Searching across {results.founders.length + results.investors.length} records</span>
                </div>
            </div>
        </div>
    );
}
