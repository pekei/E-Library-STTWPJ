import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Stats, MemberStatus, FinanceType } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, totalIncomeMonth: 0, totalExpenseMonth: 0, upcomingEvents: 0 });
  const [memberStatusData, setMemberStatusData] = useState<{name: string, value: number}[]>([]);
  const [financeData, setFinanceData] = useState<{name: string, income: number, expense: number}[]>([]);
  const [nextEvents, setNextEvents] = useState<any[]>([]);

  useEffect(() => {
    const members = StorageService.getMembers();
    const finance = StorageService.getFinanceRecords();
    const events = StorageService.getEvents();

    // 1. Member Stats
    const statusCounts: Record<string, number> = {};
    Object.values(MemberStatus).forEach(s => statusCounts[s] = 0);
    members.forEach(m => {
        if (statusCounts[m.status] !== undefined) statusCounts[m.status]++;
    });
    setMemberStatusData(Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] })).filter(d => d.value > 0));

    // 2. Finance Stats (Current Month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthFinance = finance.filter(f => {
        const d = new Date(f.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = thisMonthFinance.filter(f => f.type === FinanceType.INCOME).reduce((acc, curr) => acc + curr.amount, 0);
    const expense = thisMonthFinance.filter(f => f.type === FinanceType.EXPENSE).reduce((acc, curr) => acc + curr.amount, 0);

    // 3. Upcoming Events
    const futureEvents = events.filter(e => new Date(e.date) >= new Date(now.toISOString().split('T')[0]))
                               .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                               .slice(0, 3);
    setNextEvents(futureEvents);

    setStats({
      totalMembers: members.length,
      totalIncomeMonth: income,
      totalExpenseMonth: expense,
      upcomingEvents: futureEvents.length
    });

    // Mock Monthly Data for Bar Chart (Last 6 Months)
    // Ideally this would come from real data aggregation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const mockData = Array.from({length: 6}, (_, i) => {
        const m = (currentMonth - 5 + i + 12) % 12;
        return {
            name: months[m],
            income: Math.floor(Math.random() * 5000000) + 2000000,
            expense: Math.floor(Math.random() * 3000000) + 1000000
        };
    });
    // Replace current month with actual
    mockData[5] = { name: months[currentMonth], income, expense };
    setFinanceData(mockData);

  }, []);

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Gereja</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Jemaat</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.totalMembers}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pemasukan (Bulan Ini)</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-2 truncate">{formatIDR(stats.totalIncomeMonth)}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pengeluaran (Bulan Ini)</p>
              <h3 className="text-xl font-bold text-rose-600 mt-2 truncate">{formatIDR(stats.totalExpenseMonth)}</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <TrendingUp className="w-6 h-6 transform rotate-180" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Kegiatan Mendatang</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-2">{stats.upcomingEvents}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Finance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tren Keuangan (6 Bulan Terakhir)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => formatIDR(value)}
                  />
                  <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Member Distribution & Upcoming Events */}
        <div className="grid grid-rows-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                 <h3 className="text-lg font-semibold text-slate-800 mb-2">Status Keanggotaan</h3>
                 <div className="flex-1 flex items-center">
                    <div className="w-1/2 h-full min-h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={memberStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {memberStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-2">
                        {memberStatusData.map((entry, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                <span className="text-slate-600">{entry.name}: <span className="font-bold">{entry.value}</span></span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Agenda Terdekat</h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                    {nextEvents.length === 0 ? (
                        <p className="text-slate-400 text-sm italic">Tidak ada agenda terdekat.</p>
                    ) : (
                        nextEvents.map(event => (
                            <div key={event.id} className="flex items-start space-x-3 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                <div className="bg-purple-100 text-purple-700 rounded-lg p-2 text-center min-w-[50px]">
                                    <span className="block text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                    <span className="block text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {event.time} WIT
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;