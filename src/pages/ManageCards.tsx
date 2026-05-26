import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Plus, Trash2, ShieldCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

const ManageCards = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['payment-cards'],
    queryFn: async () => {
      const response = await api.cards.get();
      return response.data || [];
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => api.cards.delete(cardId),
    onSuccess: () => {
      toast.success('Card removed successfully');
      queryClient.invalidateQueries({ queryKey: ['payment-cards'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const defaultMutation = useMutation({
    mutationFn: (cardId: string) => api.cards.setDefault(cardId),
    onSuccess: () => {
      toast.success('Default card updated');
      queryClient.invalidateQueries({ queryKey: ['payment-cards'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Manage Cards</h1>
          <p className="text-white/80 text-sm">Your saved payment methods</p>
        </div>
      </div>

      <div className="px-6 -mt-16">
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-card rounded-3xl p-6 shadow-soft text-muted-foreground text-center">Loading cards...</div>
          ) : cards.length === 0 ? (
            <div className="bg-card rounded-3xl p-6 shadow-soft text-center">
              <CreditCard className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">No saved cards yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add a payment card for quicker wallet top-ups.</p>
            </div>
          ) : cards.map((card) => (
            <div key={card._id} className="bg-card rounded-3xl p-6 shadow-medium border border-primary/15 relative overflow-hidden group text-foreground">
              <div className="absolute inset-x-0 top-0 h-1 gradient-primary" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-[10px] tracking-wider border border-primary/20 text-primary">
                    {card.brand}
                  </div>
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <button onClick={() => defaultMutation.mutate(card._id!)} className="p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-smooth">
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteCardMutation.mutate(card._id!)} className="p-2 rounded-full bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-smooth">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="font-mono text-xl tracking-widest text-foreground">**** **** **** {card.last4}</p>
                  {card.isDefault && <p className="text-xs text-emerald-600 mt-2 font-semibold">Default card</p>}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Card Holder</p>
                    <p className="font-medium text-sm">{card.cardHolderName || 'Connectify User'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Expires</p>
                    <p className="font-medium text-sm">{card.expiryMonth}/{String(card.expiryYear).slice(-2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate('/add-funds?saveCard=true')}
            className="w-full py-5 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-medium group bg-card disabled:opacity-60"
          >
            <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            Add card through Paystack
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-70 pt-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Payments secured by Paystack</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCards;
