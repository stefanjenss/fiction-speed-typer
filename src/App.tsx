/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Target, RotateCcw, BookOpen, ChevronRight, Trophy } from 'lucide-react';
import { PASSAGES, type Passage } from './constants';

type GameState = 'START' | 'PLAYING' | 'FINISHED';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [selectedPassage, setSelectedPassage] = useState<Passage>(PASSAGES[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = endTime || Date.now();
    const timeInMinutes = (now - startTime) / 60000;
    
    // WPM = (characters / 5) / time
    const wordsTyped = userInput.length / 5;
    const currentWpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    
    // Accuracy
    let correctChars = 0;
    const targetText = selectedPassage.text;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    setErrors(userInput.length - correctChars);
  }, [userInput, startTime, endTime, selectedPassage.text]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const interval = setInterval(calculateStats, 500);
      return () => clearInterval(interval);
    }
  }, [gameState, calculateStats]);

  useEffect(() => {
    if (userInput.length === selectedPassage.text.length && gameState === 'PLAYING') {
      setGameState('FINISHED');
      setEndTime(Date.now());
    }
  }, [userInput, selectedPassage.text, gameState]);

  const handleStart = (passage: Passage) => {
    setSelectedPassage(passage);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setGameState('PLAYING');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (gameState !== 'PLAYING') return;
    if (value.length > selectedPassage.text.length) return;

    if (!startTime) {
      setStartTime(Date.now());
    }
    setUserInput(value);
  };

  const resetGame = () => {
    setGameState('START');
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
  };

  const renderText = () => {
    const targetText = selectedPassage.text;
    return targetText.split('').map((char, index) => {
      let color = 'text-zinc-500';
      let bgColor = '';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          color = 'text-emerald-400';
        } else {
          color = 'text-rose-500';
          bgColor = 'bg-rose-500/20';
        }
      } else if (index === userInput.length) {
        bgColor = 'bg-emerald-400/30 animate-pulse';
      }

      return (
        <span key={index} className={`${color} ${bgColor} transition-colors duration-150 rounded-sm`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FICTION TYPER</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Speed Test v1.0</p>
            </div>
          </div>
          
          <div className="flex gap-8 font-mono text-sm">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">WPM</span>
              <span className="text-xl font-bold text-emerald-400">{wpm}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400">{accuracy}%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-12">
        <AnimatePresence mode="wait">
          {gameState === 'START' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-light italic serif text-zinc-300">Choose your quest...</h2>
                <p className="text-zinc-500">Select a passage from iconic literature to begin your typing test.</p>
              </div>

              <div className="grid gap-4">
                {PASSAGES.map((passage) => (
                  <button
                    key={passage.id}
                    onClick={() => handleStart(passage)}
                    className="group flex items-center justify-between p-6 bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/50 transition-all rounded-xl text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                        <BookOpen className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-200">{passage.title}</h3>
                        <p className="text-sm text-zinc-500">{passage.author}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'PLAYING' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="relative p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl min-h-[200px] leading-relaxed text-2xl font-mono tracking-tight">
                {renderText()}
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
                  autoFocus
                  spellCheck={false}
                />
              </div>

              <div className="flex justify-between items-center text-zinc-500 font-mono text-xs">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span>{startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{errors} errors</span>
                  </div>
                </div>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'FINISHED' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12 py-12"
            >
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-emerald-500/10 rounded-full mb-4">
                  <Trophy className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Test Complete!</h2>
                <p className="text-zinc-500">You've successfully typed the passage from {selectedPassage.title}.</p>
              </div>

              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">WPM</span>
                  <p className="text-5xl font-bold text-emerald-400">{wpm}</p>
                </div>
                <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Accuracy</span>
                  <p className="text-5xl font-bold text-emerald-400">{accuracy}%</p>
                </div>
                <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Time</span>
                  <p className="text-5xl font-bold text-emerald-400">
                    {startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0}s
                  </p>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                Try Another Passage
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full p-6 border-t border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">
          <span>© 2026 Fiction Typer System</span>
          <div className="flex gap-4">
            <span>Status: Operational</span>
            <span className="text-emerald-500/50">●</span>
            <span>Latency: 12ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
