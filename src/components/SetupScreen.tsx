import { useState } from 'react';
import { MBTI_TYPES, type MBTI } from '../logic/mbti';
import { Plus, Play, Trash2 } from 'lucide-react';

interface SetupScreenProps {
    onStart: (employees: { name: string; dob: string; mbti: MBTI }[]) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
    const [employees, setEmployees] = useState<{ id: string; name: string; dob: string; mbti: MBTI }[]>([]);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [mbti, setMbti] = useState<MBTI>('ISTJ');

    const handleAdd = () => {
        if (!name || !dob) return;
        setEmployees([...employees, { id: Math.random().toString(), name, dob, mbti }]);
        setName('');
        setDob('');
        setMbti('ISTJ');
    };

    const handleRemove = (id: string) => {
        setEmployees(employees.filter(e => e.id !== id));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">직장생활 시뮬레이터</h1>
                <p className="text-slate-500 mb-8 text-center">팀원을 등록하고 조직의 미래를 시뮬레이션하세요.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                        value={mbti}
                        onChange={e => setMbti(e.target.value as MBTI)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {MBTI_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> 추가
                    </button>
                </div>

                <div className="space-y-3 mb-8">
                    {employees.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                            <div>
                                <span className="font-bold text-lg mr-2">{emp.name}</span>
                                <span className="text-sm text-slate-500 mr-2">{emp.mbti}</span>
                                <span className="text-xs text-slate-400">{emp.dob}</span>
                            </div>
                            <button onClick={() => handleRemove(emp.id)} className="text-red-500 hover:bg-red-100 p-2 rounded">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {employees.length === 0 && (
                        <div className="text-center text-slate-400 py-8 border-2 border-dashed border-slate-200 rounded-lg">
                            등록된 팀원이 없습니다.
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onStart(employees)}
                    disabled={employees.length < 2}
                    className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Play size={24} fill="currentColor" /> 시뮬레이션 시작 (최소 2명)
                </button>
            </div>
        </div>
    );
}
