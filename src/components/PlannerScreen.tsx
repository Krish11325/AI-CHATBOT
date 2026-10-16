import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, CheckCircle2 } from 'lucide-react';
import { StudyGoal } from '../types';

interface PlannerScreenProps {
  goals: StudyGoal[];
  onAddGoal: (goal: Partial<StudyGoal>) => void;
  onToggleGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'maths' | 'physics'>('maths');
  const [targetMin] = useState(30);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGoal({
      title: newTitle.trim(),
      subject: newSubject,
      targetMinutes: targetMin,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    });

    setNewTitle('');
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 pb-24 space-y-5 bg-[#F7F2E8] dark:bg-[#211C18]">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
          Study Planner & Goal Tracker
        </h2>
        <p className="text-xs text-[#75685C] dark:text-[#BFB2A4] font-medium">
          Plan daily revision tasks, study targets, and subject goals
        </p>
      </div>

      {/* Add New Goal Form */}
      <form
        onSubmit={handleCreate}
        className="p-5 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-3"
      >
        <h3 className="text-xs font-black uppercase tracking-wider text-[#B9785F] dark:text-[#C99A7B]">
          Add Study Task / Goal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Revise Derivatives, Solve 5 Integration questions..."
            className="sm:col-span-2 text-xs font-medium p-3 rounded-2xl border border-[#D8C3A5] dark:border-[#423730] bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] focus:outline-none focus:ring-2 focus:ring-[#3B3028]"
          />

          <div className="flex gap-2">
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value as any)}
              className="text-xs font-bold p-3 rounded-2xl border border-[#D8C3A5] dark:border-[#423730] bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] flex-1"
            >
              <option value="maths">Maths</option>
              <option value="physics">Physics</option>
            </select>

            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-3 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] disabled:opacity-40 font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>

      {/* Goals Checklist List */}
      <div className="p-5 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#3B3028] dark:text-[#F5EBDD] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#87917A]" />
            <span>Today's Study Checklist ({completedCount}/{goals.length})</span>
          </h3>
          <span className="text-xs text-[#75685C] font-extrabold">
            {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}% Completed
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#75685C] dark:text-[#BFB2A4] font-medium">
            No study tasks added for today. Add a new task above!
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => onToggleGoal(goal.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  goal.completed
                    ? 'bg-[#F7F2E8] dark:bg-[#211C18] border-[#E8DCC8] dark:border-[#423730] opacity-60'
                    : 'bg-[#FCFAF5] dark:bg-[#302822] border-[#E8DCC8] dark:border-[#423730] hover:border-[#D8C3A5]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button className="text-[#3B3028] dark:text-[#C99A7B] focus:outline-none">
                    {goal.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#87917A]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#D8C3A5]" />
                    )}
                  </button>

                  <div>
                    <span
                      className={`text-xs font-bold ${
                        goal.completed
                          ? 'line-through text-[#75685C]'
                          : 'text-[#3B3028] dark:text-[#F5EBDD]'
                      }`}
                    >
                      {goal.title}
                    </span>
                    <div className="flex items-center space-x-2 text-[10px] text-[#75685C] dark:text-[#BFB2A4] mt-0.5">
                      <span className="uppercase font-bold">
                        {goal.subject === 'maths' ? '📐 Maths' : '⚛ Physics'}
                      </span>
                      <span>•</span>
                      <span>{goal.targetMinutes} minutes</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGoal(goal.id);
                  }}
                  className="p-1.5 text-[#75685C] hover:text-[#B9785F] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
