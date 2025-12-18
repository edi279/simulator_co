import { useEffect, useRef } from 'react';
import type { GameState } from '../logic/engine';
import { FastForward, RotateCcw, Activity, Heart } from 'lucide-react';

interface SimulationDashboardProps {
    state: GameState;
    onNextDay: () => void;
    onReset: () => void;
}

export function SimulationDashboard({ state, onNextDay, onReset }: SimulationDashboardProps) {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [state.logs]);

    const getRelColor = (score: number) => {
        if (score > 50) return 'bg-pink-500 text-white';
        if (score > 20) return 'bg-pink-300 text-pink-900';
        if (score > 0) return 'bg-green-100 text-green-800';
        if (score > -20) return 'bg-gray-100 text-gray-500';
        if (score > -50) return 'bg-orange-100 text-orange-800';
        return 'bg-red-500 text-white';
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-lg">Day {state.day}</span>
                        <span className="text-slate-600">직장생활 시뮬레이션</span>
                    </h2>
                </div>
                <div className="flex gap-3">
                    <button onClick={onReset} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-2">
                        <RotateCcw size={18} /> 초기화
                    </button>
                    <button onClick={onNextDay} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 active:scale-95 transition flex items-center gap-2">
                        <FastForward size={20} fill="currentColor" /> 다음 날
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">

                {/* Left Col: Employees & Rel Matrix */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">

                    {/* Employee Cards */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm overflow-x-auto">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
                            <Activity size={20} /> 멤버 상태
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {state.employees.map(emp => (
                                <div key={emp.id} className="border p-4 rounded-xl hover:shadow-md transition bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-bold text-lg">{emp.name}</div>
                                            <div className="text-xs text-slate-400">{emp.mbti} • {emp.saju.primaryElement}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm flex justify-between">
                                            <span>Mood</span>
                                            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1.5 overflow-hidden">
                                                <div className="bg-green-500 h-full" style={{ width: `${emp.mood}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Relationship Matrix */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm flex-1 overflow-auto">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
                            <Heart size={20} /> 관계도
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-center text-sm">
                                <thead>
                                    <tr>
                                        <th className="p-2"></th>
                                        {state.employees.map(e => <th key={e.id} className="p-2 font-bold text-slate-600">{e.name}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.employees.map(from => (
                                        <tr key={from.id}>
                                            <td className="p-2 font-bold text-slate-600 text-left">{from.name}</td>
                                            {state.employees.map(to => {
                                                if (from.id === to.id) return <td key={to.id} className="p-2 bg-slate-50">·</td>;
                                                const rel = state.relationships.find(r => r.fromId === from.id && r.toId === to.id);
                                                const score = rel ? rel.score : 0;
                                                return (
                                                    <td key={to.id} className="p-1">
                                                        <div className={`rounded py-1 px-2 ${getRelColor(score)} font-medium`}>
                                                            {score}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Col: Logs */}
                <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
                    <h3 className="text-lg font-bold mb-4 text-slate-100 flex items-center gap-2">
                        <Activity size={20} /> 활동 로그
                    </h3>
                    <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {state.logs.length === 0 && <div className="text-slate-600 text-center italic mt-10">시뮬레이션을 시작해보세요.</div>}
                        {[...state.logs].reverse().map(log => (
                            <div key={log.id} className={`p-3 rounded-lg text-sm border-l-4 ${log.type === 'positive' ? 'border-green-500 bg-slate-800' :
                                log.type === 'negative' ? 'border-red-500 bg-slate-800' :
                                    'border-slate-500 bg-slate-800/50'
                                }`}>
                                <span className="text-slate-400 text-xs font-mono mr-2">[Day {log.day}]</span>
                                <span>{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
