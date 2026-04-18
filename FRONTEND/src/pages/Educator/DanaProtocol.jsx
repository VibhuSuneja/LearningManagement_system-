import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaArrowLeft, 
    FaChartLine, 
    FaReceipt, 
    FaShieldAlt, 
    FaFileInvoiceDollar,
    FaArrowUp,
    FaArrowDown,
    FaDownload
} from 'react-icons/fa';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../App';
import Nav from '../../component/Nav';
import Footer from '../../component/Footer';
import { ClipLoader } from 'react-spinners';

const DanaDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDanaData = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/dana/highlights`, { withCredentials: true });
                setData(response.data);
            } catch (error) {
                console.error("DANA Protocol Link Failure:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDanaData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            <ClipLoader color="#fff" size={50} />
            <span className="mt-8 text-[10px] uppercase tracking-[0.6em] text-white/30 font-black">Establishing Dana Protocol Sync...</span>
        </div>
    );

    const { overview, monthlyData, topCourses, recentTransactions } = data || {};

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            <Nav />
            
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[180px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>

            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20"
            >
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Exit</span>
                        </button>
                        <div className="space-y-1">
                            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] mb-2">Phase 5: Dana Financial</h2>
                            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
                                Financial<br />
                                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-white/20">Protocol</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-4 rounded-[32px]">
                        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl text-black">
                            <FaShieldAlt size={20} />
                        </div>
                        <div className="pr-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Verification Status</p>
                            <p className="text-sm font-black text-green-500 uppercase tracking-widest">Dana Hardened</p>
                        </div>
                    </div>
                </header>

                {/* KPI Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Gross Revenue", value: `₹${overview.totalRevenue.toLocaleString()}`, sub: "Total volume processed", icon: <FaChartLine /> },
                        { label: "Tax Liability", value: `₹${overview.totalTax.toLocaleString()}`, sub: "GST 18% inclusive", icon: <FaFileInvoiceDollar />, color: "text-red-400" },
                        { label: "Net Earnings", value: `₹${overview.netEarnings.toLocaleString()}`, sub: "Post-tax yield", icon: <FaReceipt />, color: "text-green-400" },
                        { label: "Asset Sales", value: overview.totalSales, sub: "Unique enrollments", icon: <FaArrowUp /> }
                    ].map((kpi, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 group relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                {kpi.icon}
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">{kpi.label}</p>
                            <h3 className={`text-3xl font-black tracking-tighter mb-2 ${kpi.color || 'text-white'}`}>{kpi.value}</h3>
                            <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{kpi.sub}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Charts Section */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 md:p-14">
                        <div className="flex items-center justify-between mb-16">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Growth Trajectory</h3>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Monthly revenue processing (6M)</p>
                            </div>
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" /> Volume</span>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="danaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900}}
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}
                                        itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#danaGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Assets */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 md:p-14">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-14">High Yield Assets</h3>
                        <div className="space-y-10">
                            {topCourses.map((course, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                                        <span className="truncate w-2/3">{course.title}</span>
                                        <span className="text-white/40">₹{course.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(course.revenue / overview.totalRevenue) * 100}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Ledger / Recent Activity */}
                <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 md:p-14">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Transaction Ledger</h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Cryptographically verified entries</p>
                        </div>
                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-colors">
                            Export Manifest
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="pb-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Ref Index</th>
                                    <th className="pb-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Counterparty</th>
                                    <th className="pb-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Asset Track</th>
                                    <th className="pb-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 text-right">Value (INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((tx, i) => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="py-6">
                                            <span className="text-[10px] font-black font-mono text-white/40">#{tx.invoiceNumber}</span>
                                        </td>
                                        <td className="py-6">
                                            <p className="text-xs font-black uppercase tracking-tighter">{tx.student}</p>
                                            <p className="text-[8px] text-white/30 uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-[10px] font-black text-white/60 tracking-tight">{tx.course}</span>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="text-sm font-black text-white tracking-widest">₹{tx.amount}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </motion.main>

            <Footer />
        </div>
    );
};

export default DanaDashboard;
