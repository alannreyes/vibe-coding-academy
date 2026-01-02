'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
  Keyboard,
  Terminal,
  SkipForward,
  CheckCircle2,
} from 'lucide-react';

type OS = 'windows' | 'mac' | 'linux';

interface Instruction {
  type: 'text' | 'link' | 'command' | 'tip' | 'warning' | 'shortcut' | 'image';
  content?: string;
  label?: string;
  url?: string;
  keys?: string[];
  then?: string;
  src?: string;
  alt?: string;
}

interface Step {
  id: string;
  title: string;
  description?: string;
  skip?: {
    label: string;
    skipToStep: string;
  };
  instructions?: Instruction[]; // For non-OS-specific steps
  os?: {
    windows?: { instructions: Instruction[] };
    mac?: { instructions: Instruction[] };
    linux?: { instructions: Instruction[] };
  };
  checkpoint?: {
    title?: string;
    items: string[];
  };
}

interface StepRendererProps {
  steps: Step[];
  userOS: OS;
  currentStep: number;
  onStepChange: (step: number) => void;
  completedSteps: string[];
  onStepComplete: (stepId: string) => void;
}

export default function StepRenderer({
  steps,
  userOS,
  currentStep,
  onStepChange,
  completedSteps,
  onStepComplete,
}: StepRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([currentStep]));

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const handleSkip = (skipToStep: string) => {
    const targetIndex = steps.findIndex((s) => s.id === skipToStep);
    if (targetIndex !== -1) {
      // Mark all skipped steps as complete
      for (let i = currentStep; i < targetIndex; i++) {
        onStepComplete(steps[i].id);
      }
      onStepChange(targetIndex);
      setExpandedSteps(new Set([targetIndex]));
    }
  };

  const getInstructions = (step: Step): Instruction[] => {
    if (step.instructions) return step.instructions;
    if (step.os && step.os[userOS]) return step.os[userOS]!.instructions;
    return [];
  };

  const renderInstruction = (instruction: Instruction, index: number, stepId: string) => {
    const key = `${stepId}-${index}`;

    switch (instruction.type) {
      case 'text':
        return (
          <p key={key} className="text-slate-600 leading-relaxed">
            {instruction.content}
          </p>
        );

      case 'link':
        return (
          <a
            key={key}
            href={instruction.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            {instruction.label}
          </a>
        );

      case 'command':
        return (
          <div key={key} className="relative group">
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Terminal</span>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              {instruction.content}
            </pre>
            <button
              onClick={() => copyToClipboard(instruction.content!, key)}
              className="absolute top-8 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition"
            >
              {copiedIndex === key ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        );

      case 'tip':
        return (
          <div
            key={key}
            className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">{instruction.content}</p>
          </div>
        );

      case 'warning':
        return (
          <div
            key={key}
            className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{instruction.content}</p>
          </div>
        );

      case 'shortcut':
        return (
          <div
            key={key}
            className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg"
          >
            <Keyboard className="w-5 h-5 text-slate-500" />
            <div className="flex items-center gap-2">
              {instruction.keys?.map((k, i) => (
                <span key={i}>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-sm font-mono shadow-sm">
                    {k}
                  </kbd>
                  {i < instruction.keys!.length - 1 && (
                    <span className="mx-1 text-slate-400">+</span>
                  )}
                </span>
              ))}
              {instruction.then && (
                <span className="text-slate-600 text-sm ml-2">
                  → {instruction.then}
                </span>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div key={key} className="rounded-lg overflow-hidden border">
            <img
              src={instruction.src}
              alt={instruction.alt || ''}
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = index === currentStep;
        const isExpanded = expandedSteps.has(index);
        const instructions = getInstructions(step);

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              border rounded-xl overflow-hidden transition-all
              ${isCurrent ? 'border-cyan-300 shadow-lg shadow-cyan-100' : 'border-slate-200'}
              ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}
            `}
          >
            {/* Step Header */}
            <button
              onClick={() => toggleStep(index)}
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition"
            >
              {/* Step Number */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold
                  ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-600'}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Title */}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                {step.description && (
                  <p className="text-sm text-slate-500">{step.description}</p>
                )}
              </div>

              {/* Expand icon */}
              <div className="text-slate-400">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* Step Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t pt-4">
                    {/* Skip option */}
                    {step.skip && !isCompleted && (
                      <button
                        onClick={() => handleSkip(step.skip!.skipToStep)}
                        className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        <SkipForward className="w-4 h-4" />
                        {step.skip.label}
                      </button>
                    )}

                    {/* Instructions */}
                    <div className="space-y-4">
                      {instructions.map((inst, i) =>
                        renderInstruction(inst, i, step.id)
                      )}
                    </div>

                    {/* Checkpoint */}
                    {step.checkpoint && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-slate-500" />
                          {step.checkpoint.title || 'Verifica antes de continuar'}
                        </h4>
                        <ul className="space-y-2">
                          {step.checkpoint.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white">
                                {isCompleted && (
                                  <Check className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Complete Step Button */}
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          onStepComplete(step.id);
                          if (index < steps.length - 1) {
                            onStepChange(index + 1);
                            setExpandedSteps(new Set([index + 1]));
                          }
                        }}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Completar paso {index + 1}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
