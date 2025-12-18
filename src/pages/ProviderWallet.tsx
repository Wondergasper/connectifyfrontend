import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowDownLeft, ArrowUpLeft, TrendingUp, CreditCard, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useWalletBalance, useWalletTransactions } from "@/hooks/useWallet";

const ProviderWallet = () => {
  const navigate = useNavigate();

  // Fetch wallet data from API
  const { data: walletBalance, isLoading: balanceLoading, isError: balanceError } = useWalletBalance();
  const { data: transactions, isLoading: transactionsLoading, isError: transactionsError } = useWalletTransactions();

  // Show loading state while fetching data
  if (balanceLoading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  if (balanceError || transactionsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Wallet</h2>
          <p className="text-muted-foreground mb-4">Failed to load your wallet data. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Fallback to mock icons since they're not in API
  const getTransactionIcon = (type: string) => {
    return type === "credit" ? ArrowDownLeft : ArrowUpLeft;
  };

  const handleAddFunds = () => navigate("/wallet/add-funds");
  const handleWithdraw = () => navigate("/wallet/withdraw");
  const handleViewAllTransactions = () => navigate("/wallet/transactions");

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center text-white mb-4">
          <p className="text-white/80 text-sm mb-1">Total Balance</p>
          <h1 className="text-4xl font-bold drop-shadow-md">{walletBalance?.balance ? `₦${walletBalance.balance.toLocaleString()}` : '₦0'}</h1>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 px-6">
          <Button
            onClick={handleAddFunds}
            className="flex-1 h-12 gradient-primary border-0 text-white font-semibold shadow-medium hover:shadow-strong"
          >
            <ArrowDownLeft className="w-5 h-5 mr-2" />
            Add Funds
          </Button>
          <Button
            onClick={handleWithdraw}
            variant="outline"
            className="flex-1 h-12 border-2 border-primary/20 text-primary hover:bg-primary/5"
          >
            <ArrowUpLeft className="w-5 h-5 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <div className="text-lg font-bold text-foreground">₦450k</div>
            <div className="text-xs text-green-600 font-medium">+12% this month</div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="text-lg font-bold text-foreground">₦25k</div>
            <div className="text-xs text-muted-foreground">Clears in 2 days</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <button onClick={handleViewAllTransactions} className="text-sm text-primary font-medium">
            View all
          </button>
        </div>
        <div className="space-y-3">
          {Array.isArray(transactions?.data) && transactions.data.length > 0 ? (
            transactions.data.slice(0, 4).map((tx, index) => {
              const Icon = getTransactionIcon(tx.type);
              return (
                <div
                  key={tx.id || index}
                  className="bg-card rounded-2xl p-4 shadow-soft border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">{tx.description || tx.title || tx.type}</h3>
                      <p className="text-xs text-muted-foreground truncate">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-foreground"}`}>{tx.type === 'credit' ? '+' : '-'}₦{tx.amount?.toLocaleString() || 0}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Your transactions will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderWallet;
