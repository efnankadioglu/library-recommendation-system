import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getRecommendations } from '@/services/api';
import { handleApiError } from '@/utils/errorHandling';

/**
 * Recommendations page component with REAL AI-powered suggestions
 * ✅ Week 4: Fully connected to Amazon Bedrock
 */
export function Recommendations() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const exampleQueries = [
    'I love mystery novels with strong female protagonists',
    'Looking for science fiction books about space exploration',
    'Recommend me some feel-good romance novels',
    'I want to read about personal development and productivity',
  ];

  const handleGetRecommendations = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      // API'ye gerçek kullanıcı sorgusunu gönderiyoruz
      const responseText = await getRecommendations(query);
      setAiResponse(responseText);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">AI-Powered Recommendations</span>
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Powered by Amazon Bedrock - Real-time smart book suggestions
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What kind of book are you looking for?
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your ideal book... (e.g., 'I want a thrilling mystery set in Victorian London')"
            className="input-modern min-h-[140px] resize-none"
          />

          <div className="mt-6">
            <p className="text-sm text-slate-700 font-semibold mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-sm bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-slate-800 px-4 py-2 rounded-xl transition-all border border-violet-200 hover:border-violet-300 font-medium"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button variant="primary" size="lg" onClick={handleGetRecommendations} disabled={isLoading} className="w-full">
              {isLoading ? 'Thinking...' : 'Get AI Recommendations'}
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-600 animate-pulse font-medium">Consulting with Amazon Bedrock...</p>
          </div>
        )}

        {/* AI Response Section */}
        {!isLoading && aiResponse && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="gradient-text">Recommended for You</span>
            </h2>

            <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 p-8 hover-glow transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">AI Assistant</p>
                  <p className="text-xs text-slate-400">Powered by Claude 3 Haiku</p>
                </div>
              </div>
              
              {/* whitespace-pre-wrap: Bedrock'tan gelen satır boşluklarını korur */}
              <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap bg-white/40 p-6 rounded-2xl border border-white/60">
                {aiResponse}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !aiResponse && !query && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg italic">
              "A book is a dream that you hold in your hand." - Enter a description above to find your next dream.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}