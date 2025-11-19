import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const WriteReview = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        toast.success("Review submitted successfully!");
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="gradient-primary px-6 pt-12 pb-24 rounded-b-[3rem] relative overflow-hidden shadow-strong">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="text-center text-white">
                    <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
                    <p className="text-white/80">How was your experience with Chioma?</p>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-10">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border space-y-8">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-muted text-muted-foreground/30"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="text-center text-sm font-medium text-muted-foreground -mt-4">
                        {rating === 5 && "Excellent!"}
                        {rating === 4 && "Good"}
                        {rating === 3 && "Average"}
                        {rating === 2 && "Poor"}
                        {rating === 1 && "Terrible"}
                        {rating === 0 && "Tap to rate"}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Your Review</label>
                        <Textarea
                            placeholder="Share your experience..."
                            className="min-h-[150px] rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-smooth resize-none p-4 text-base"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full h-12 rounded-xl gradient-primary border-0 font-bold shadow-medium hover:shadow-strong hover:scale-[1.02] transition-all"
                    >
                        Submit Review
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WriteReview;
