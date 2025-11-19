import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, TrendingUp, CreditCard, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock transaction data (same as before)
const transactions = [
  { id: 1, type: "debit", title: "Withdrawal to GTBank", date: "Today, 2:30 PM", amount: "-₦50,000" },
  { id: 2, type: "credit", title: "Payment from Adebayo", date: "Yesterday, 4:15 PM", amount: "+₦15,000" },
  { id: 3, type: "credit", title: "Payment from Grace", date: "Dec 12, 10:00 AM", amount: "+₦25,000" },
  { id: 4, type: "debit", title: "Subscription Fee", date: "Dec 10, 9:00 AM", amount: "-₦5,000" },
];

const ProviderWallet = () => {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-bold drop-shadow-md">₦234,500</h1>
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
            <ArrowUpRight className="w-5 h-5 mr-2" />
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
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm">{tx.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{tx.date}</p>
                </div>
              </div>
              <div className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-foreground"}`}>{tx.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderWallet;
