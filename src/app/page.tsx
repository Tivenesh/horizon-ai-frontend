// src/app/page.js (or page.tsx)

"use client"; // This line is crucial for Next.js App Router for client-side interactivity

import { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // Will store { summary, imageUrl, audioUrl }
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setResult(null); // Clear previous results
    setError(null); // Clear previous errors

    try {
      // Make the POST request to your Node.js backend
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data); // Set the results (summary, imageUrl, audioUrl)

    } catch (err) {
      console.error("Frontend: Error fetching data from backend:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Horizon AI
      </h1>
      <p className="text-xl text-gray-300 mb-10">Your Market Intelligence Navigator</p>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-xl">
        <textarea
          className="w-full p-4 text-lg bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 resize-none"
          rows="3"
          placeholder="e.g., 'What's the outlook for US tech stocks, including news on NVDA and sentiment on AI?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        ></textarea>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Get Market Intelligence'}
        </button>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-800 text-white rounded-lg max-w-2xl w-full">
          <h2 className="text-xl font-semibold mb-2">Error:</h2>
          <p>{error}</p>
          <p className="text-sm mt-2">Please check your backend terminal for more details or try again.</p>
        </div>
      )}

      {result && (
        <div className="mt-12 w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
            Your Horizon AI Briefing
          </h2>

          {result.audioUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Audio Briefing:</h3>
              <audio controls className="w-full rounded-md">
                <source src={result.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {result.imageUrl && (
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Visual Insight:</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.imageUrl} alt="AI Generated Infographic" className="rounded-lg shadow-lg max-w-full h-auto mx-auto border border-gray-700" />
            </div>
          )}

          {result.summary && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Detailed Summary:</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}