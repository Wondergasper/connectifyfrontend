import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Building, Send, ChevronDown, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useWalletBalance, useBanks, useResolveAccount, useWithdraw } from "@/hooks/useWallet";

const Withdraw = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [bankSearch, setBankSearch] = useState("");

  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance();
  const { data: banksData, isLoading: banksLoading } = useBanks();
  const { mutate: resolveAccount, isPending: isResolving } = useResolveAccount();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();

  const balance = (balanceData as any)?.balance ?? (balanceData as any)?.data?.balance ?? 0;
  const banks = banksData?.data ?? [];
  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  // Auto-resolve account when accountNumber is 10 digits and bank is selected
  useEffect(() => {
    setResolvedName("");
    if (accountNumber.length === 10 && bankCode) {
      resolveAccount(
        { accountNumber, bankCode },
        {
          onSuccess: (data) => {
            setResolvedName(data?.data?.accountName || "");
          },
        }
      );
    }
  }, [accountNumber, bankCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectBank = (code: string, name: string) => {
    setBankCode(code);
    setBankName(name);
    setShowBankList(false);
    setBankSearch("");
    setResolvedName("");
  };

  const handleWithdraw = () => {
    if (!amount || !accountNumber || !bankCode || !resolvedName) {
      toast.error("Please fill in all fields and verify your account");
      return;
    }
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
      toast.error("Minimum withdrawal is ₦100");
      return;
    }
    if (withdrawAmount > balance) {
      toast.error(`Insufficient balance. Available: ₦${balance.toLocaleString()}`);
      return;
    }

    withdraw(
      { amount: withdrawAmount, accountNumber, bankCode, accountName: resolvedName },
      {
        onSuccess: () => {
          setTimeout(() => navigate(-1), 2000);
        },
      }
    );
  };

  const isPending = isWithdrawing;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h1>
          <p className="text-white/80 text-sm">Transfer your earnings to your bank</p>
        </div>
      </div>

      <div className="px-6 -mt-16 space-y-4">
        {/* Balance Card */}
        <div className="bg-card rounded-3xl p-6 shadow-strong border border-border relative z-10">
          <div className="p-5 rounded-2xl bg-muted/30 border border-border text-center mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Available Balance
            </p>
            <p className="text-3xl font-bold text-foreground">
              {balanceLoading ? "…" : `₦${balance.toLocaleString()}`}
            </p>
          </div>

          <div className="space-y-5">
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                Amount to Withdraw
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-xl">₦</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-10 text-2xl font-bold h-16 text-center bg-muted/30 border-border/50 focus:bg-background transition-smooth rounded-2xl"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isPending}
                  min={100}
                  max={balance}
                />
              </div>
              {balance > 0 && (
                <button
                  className="text-xs text-primary font-semibold"
                  onClick={() => setAmount(String(balance))}
                >
                  Withdraw all (₦{balance.toLocaleString()})
                </button>
              )}
            </div>

            {/* Bank Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                Select Bank
              </label>
              <button
                onClick={() => setShowBankList(!showBankList)}
                disabled={isPending || banksLoading}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-smooth text-left"
              >
                <Building className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className={`flex-1 text-sm ${bankName ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {banksLoading ? "Loading banks…" : bankName || "Select your bank"}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showBankList ? "rotate-180" : ""}`} />
              </button>

              {showBankList && (
                <div className="border border-border rounded-2xl overflow-hidden shadow-strong bg-card">
                  <div className="p-3 border-b border-border">
                    <Input
                      placeholder="Search bank…"
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                      className="h-9 text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredBanks.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">No banks found</p>
                    ) : (
                      filteredBanks.map((bank) => (
                        <button
                          key={bank.code}
                          className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0"
                          onClick={() => handleSelectBank(bank.code, bank.name)}
                        >
                          {bank.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                Account Number
              </label>
              <Input
                type="text"
                placeholder="0000000000"
                maxLength={10}
                className="h-12 text-lg font-mono tracking-widest rounded-xl"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                disabled={isPending}
              />
            </div>

            {/* Account Name Verification */}
            {accountNumber.length === 10 && bankCode && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                resolvedName
                  ? "bg-green-500/10 border border-green-500/30"
                  : isResolving
                  ? "bg-muted/30 border border-border"
                  : "bg-red-500/10 border border-red-500/30"
              }`}>
                {isResolving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Verifying account…</span>
                  </>
                ) : resolvedName ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-green-700 font-medium uppercase tracking-wider">Account Verified</p>
                      <p className="text-base font-bold text-foreground">{resolvedName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-600">Account not found. Check your details.</span>
                  </>
                )}
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleWithdraw}
              disabled={isPending || !resolvedName || !amount}
              className="w-full gradient-primary border-0 h-14 text-lg font-semibold shadow-medium hover:shadow-strong transition-all hover:scale-[1.02] rounded-xl"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Withdrawal…
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Withdraw ₦{amount ? parseFloat(amount).toLocaleString() : "0"}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Powered by Paystack Transfer · Funds arrive within minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
