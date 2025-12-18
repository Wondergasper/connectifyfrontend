import { ArrowLeft, ArrowDownLeft, ArrowUpLeft, Filter, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useWalletTransactions } from "@/hooks/useWallet";

const Transactions = () => {
    const navigate = useNavigate();
    const { data: transactionsData, isLoading } = useWalletTransactions();

    const transactions = transactionsData?.data || [];

    // Get transaction icon based on type
    const getTransactionIcon = (type: string) => {
        return type === "credit" ? ArrowDownLeft : ArrowUpLeft;
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
                        <p className="text-white/80 text-sm">History of your payments</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth">
                        <Download className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                        placeholder="Search transactions..."
                        className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-smooth backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="px-6 -mt-8 space-y-4">
                <div className="bg-card rounded-3xl p-2 shadow-strong border border-border relative z-10">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 hover:bg-muted/30 transition-smooth first:rounded-t-2xl last:rounded-b-2xl flex items-center justify-between group animate-pulse"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-muted" />
                                    <div className="flex-1 space-y-1">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="h-3 bg-muted rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                                    <div className="h-3 bg-muted rounded w-16"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="divide-y divide-border">
                            {transactions.map((tx) => {
                                const Icon = getTransactionIcon(tx.type);
                                return (
                                    <div
                                        key={tx._id || tx.id}
                                        className="p-4 hover:bg-muted/30 transition-smooth first:rounded-t-2xl last:rounded-b-2xl flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${tx.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10'
                                                }`}>
                                                <Icon className={`w-6 h-6 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground text-sm mb-0.5">{tx.description || tx.title || tx.type}</h3>
                                                <p className="text-xs text-muted-foreground">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-bold text-sm block mb-0.5 ${tx.type === 'credit' ? 'text-green-600' : 'text-foreground'
                                                }`}>
                                                {tx.type === 'credit' ? '+' : '-'}₦{tx.amount?.toLocaleString() || 0}
                                            </span>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                                                }`}>
                                                {tx.status?.charAt(0).toUpperCase() + tx.status?.slice(1) || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;
