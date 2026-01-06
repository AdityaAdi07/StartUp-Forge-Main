import { User, Wallet } from 'lucide-react';

interface SearchResultsDropdownProps {
    results: {
        founders: string[];
        investors: string[];
    };
    isVisible: boolean;
    isLoading: boolean;
}

export function SearchResultsDropdown({ results, isVisible, isLoading }: SearchResultsDropdownProps) {
    if (!isVisible) return null;

    // content parser helper - customized for compact display
    const parseContent = (text: string) => {
        // splits "Key: Value." strings
        const parts = text.split('.').filter(p => p.trim().length > 0);
        const data: Record<string, string> = {};
        parts.forEach(p => {
            const [key, ...val] = p.split(':');
            if (key && val) {
                data[key.trim().toLowerCase()] = val.join(':').trim();
            }
        });
        return data;
    };

    const hasFounders = results.founders.length > 0;
    const hasInvestors = results.investors.length > 0;

    // Always render to allow "No results" message

    // Always render to allow "No results" message

    return (
        <div className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] ring-1 ring-white/10 relative">

            {isLoading && x_IsSearchingIndicator()}

            {!isLoading && !hasFounders && !hasInvestors && (
                <div className="p-8 text-center text-slate-400">
                    <p className="text-sm font-medium">No matches found</p>
                    <p className="text-xs text-slate-500 mt-1">Try keywords like "AI", "SaaS", or specific names.</p>
                </div>
            )}

            <div className="overflow-y-auto flex-1 p-2 space-y-4 custom-scrollbar">
                {/* Founders Section */}
                {hasFounders && (
                    <div>
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white uppercase tracking-wider bg-slate-800/50 rounded-lg mb-1">
                            <User className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Founders ({results.founders.length})</span>
                        </div>
                        <div className="space-y-1">
                            {results.founders.map((item, idx) => {
                                const data = parseContent(item);
                                return (
                                    <div key={idx} className="p-3 bg-slate-800/30 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group border border-slate-700/50 hover:border-slate-600">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-white">
                                                    {data['founder'] || data['founder name'] || data['name'] || 'Unknown Founder'}
                                                </h4>
                                                <p className="text-xs text-slate-300 font-medium mt-0.5">
                                                    {data['company'] || 'Unknown Company'}
                                                    {data['funding round'] && <span className="ml-2 text-slate-400">• {data['funding round']}</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Investors Section */}
                {hasInvestors && (
                    <div>
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white uppercase tracking-wider bg-slate-800/50 rounded-lg mb-1 mt-2">
                            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Investors ({results.investors.length})</span>
                        </div>
                        <div className="space-y-1">
                            {results.investors.map((item, idx) => {
                                const data = parseContent(item);
                                return (
                                    <div key={idx} className="p-3 bg-slate-800/30 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group border border-slate-700/50 hover:border-slate-600">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-white">
                                                    {data['investor name'] || data['name'] || 'Unknown Investor'}
                                                </h4>
                                                <p className="text-xs text-slate-300 font-medium mt-0.5">
                                                    {data['firm'] || data['firm_name'] || 'Unknown Firm'}
                                                    {data['preferred stage'] && <span className="ml-2 text-slate-400">• {data['preferred stage']}</span>}
                                                </p>
                                            </div>
                                            {data['domain'] && (
                                                <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                                    {data['domain']}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-2 bg-slate-900 border-t border-slate-700 text-center">
                <p className="text-[10px] text-slate-500 font-medium">Press Enter for full results</p>
            </div>
        </div>
    );
}

function x_IsSearchingIndicator() {
    return (
        <div className="p-4 flex items-center justify-center gap-2 text-slate-400 border-b border-slate-700">
            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Searching...</span>
        </div>
    )
}
