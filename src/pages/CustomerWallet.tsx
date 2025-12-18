import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, Plus, Wallet as WalletIcon, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useWalletBalance, useWalletTransactions } from "@/hooks/useWallet";

const CustomerWallet = () => {
  const navigate = useNavigate();

  // Fetch wallet data from API
  const { data: walletBalance, isLoading: balanceLoading, isError: balanceError } = useWalletBalance();
  const { data: transactions, isLoading: transactionsLoading, isError: transactionsError } = useWalletTransactions();

  // Fallback to mock icons since they're not in API
  const getTransactionIcon = (type: string) => {
    return type === "credit" ? Plus : ArrowUpRight;
  };

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

  const handleTopUp = () => {
    navigate("/wallet/add-funds");
  };

  const handleManageCards = () => {
    navigate("/wallet/cards");
  };

  const handleQuickTopUp = (amount: string) => {
    toast.success(`Top‑up initiated for ${amount}`, {
      description: "Please complete the payment to credit your wallet.",
    });
  };

  const handleViewAllTransactions = () => {
    navigate("/wallet/transactions");
  };

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
        <div className="text-center text-white mb-6">
          <p className="text-white/80 text-sm mb-1">My Wallet</p>
          <h1 className="text-5xl font-bold mb-1 animate-fade-in">{walletBalance?.balance ? `₦${walletBalance.balance.toLocaleString()}` : '₦0'}</h1>
          <p className="text-xs opacity-75">Ready for your next booking</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleTopUp}
            className="flex-1 h-12 bg-white text-primary hover:bg-white/90 font-semibold shadow-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Top Up
          </Button>
          <Button
            onClick={handleManageCards}
            className="flex-1 h-12 bg-white/20 text-white hover:bg-white/30 border-0 font-semibold backdrop-blur-sm"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Cards
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-6 grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
          <div className="text-sm text-muted-foreground mb-1">This Month</div>
          <div className="text-2xl font-bold text-foreground">₦32,500</div>
          <div className="text-xs text-muted-foreground mt-1">5 bookings</div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Saved</div>
          <div className="text-2xl font-bold text-foreground">₦8,750</div>
          <div className="text-xs text-accent font-medium mt-1">via discounts</div>
        </div>
      </div>

      {/* Quick Top‑up */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Top‑up</h2>
        <div className="grid grid-cols-3 gap-3">
          {['₦5,000', '₦10,000', '₦20,000'].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickTopUp(amount)}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-medium hover:border-primary/30 transition-smooth"
            >
              <div className="text-xl font-bold text-foreground">{amount}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-6 grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
          <div className="text-sm text-muted-foreground mb-1">This Month</div>
          <div className="text-2xl font-bold text-foreground">₦{
            (Array.isArray(transactions?.data) && transactions.data.slice(0, 3).reduce((sum, tx) => sum + (tx.type === 'debit' ? -Math.abs(tx.amount || 0) : Math.abs(tx.amount || 0)), 0) || 0).toLocaleString()
          }</div>
          <div className="text-xs text-muted-foreground mt-1">{Array.isArray(transactions?.data) ? transactions.data.length : 0} transactions</div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Saved</div>
          <div className="text-2xl font-bold text-foreground">₦8,750</div>
          <div className="text-xs text-accent font-medium mt-1">via discounts</div>
        </div>
      </div>

      {/* Quick Top‑up */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Top‑up</h2>
        <div className="grid grid-cols-3 gap-3">
          {['₦5,000', '₦10,000', '₦20,000'].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickTopUp(amount)}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-medium hover:border-primary/30 transition-smooth"
            >
              <div className="text-xl font-bold text-foreground">{amount}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <button
            onClick={handleViewAllTransactions}
            className="text-sm text-primary font-medium"
          >
            View all
          </button>
        </div>
        <div className="space-y-2">
          {Array.isArray(transactions?.data) && transactions.data.length > 0 ? (
            transactions.data.slice(0, 4).map((tx, index) => {
              const Icon = getTransactionIcon(tx.type);
              return (
                <div
                  key={tx.id || index}
                  className="bg-card rounded-2xl p-4 shadow-soft border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">{tx.description || tx.type}</h3>
                      <p className="text-xs text-muted-foreground truncate">{tx.serviceName || tx.providerName || tx.source}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`text-right font-semibold ${tx.type === "credit" ? "text-accent" : "text-foreground"}`}>{tx.type === 'credit' ? '+' : '-'}₦{tx.amount?.toLocaleString() || 0}</div>
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

      {/* Security Notice */}
      <div className="px-6">
        <div className="bg-muted/50 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔒</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">Your money is safe</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Funds are held securely until service completion. Automatic refund if service is cancelled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWallet;
