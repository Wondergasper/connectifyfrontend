import { useState } from 'react';
import { Upload, FileCheck, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface VerificationUploadProps {
    onUploadComplete?: () => void;
}

export const VerificationUpload = ({ onUploadComplete }: VerificationUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) return;

        if (uploadedDocs.length + files.length > 5) {
            toast.error('Maximum 5 documents allowed');
            return;
        }

        // Validate files
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

            if (!isValid) {
                toast.error(`${file.name} must be an image or PDF`);
                return false;
            }
            if (!isValidSize) {
                toast.error(`${file.name} is too large (max 5MB)`);
                return false;
            }
            return true;
        });

        if (!validFiles.length) return;

        setUploading(true);

        try {
            const response = await api.upload.verification(validFiles);

            setUploadedDocs(prev => [...prev, ...response.data.urls]);
            toast.success(`${validFiles.length} document(s) uploaded successfully!`);

            // Invalidate profile query to refetch
            queryClient.invalidateQueries({ queryKey: ['profile'] });

            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error) {
            console.error('Verification upload error:', error);
            toast.error('Failed to upload documents. Please try again.');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-3">
            {/* ID Upload */}
            <label className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary transition-smooth text-left block cursor-pointer">
                <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading || uploadedDocs.length >= 5}
                    className="hidden"
                />
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {uploadedDocs.length > 0 ? (
                            <FileCheck className="w-6 h-6 text-green-500" />
                        ) : (
                            '🪪'
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">National ID</div>
                        <div className="text-xs text-muted-foreground">
                            {uploadedDocs.length > 0
                                ? `${uploadedDocs.length} document(s) uploaded`
                                : "NIN, Driver's License, or Voter's Card"
                            }
                        </div>
                    </div>
                    {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                        <Upload className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
            </label>

            {/* Business Document (Optional) */}
            <label className="w-full p-4 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary transition-smooth text-left block cursor-pointer">
                <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading || uploadedDocs.length >= 5}
                    className="hidden"
                />
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        📄
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">Business Document</div>
                        <div className="text-xs text-muted-foreground">Registration or License (Optional)</div>
                    </div>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
            </label>

            {/* Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    🔒 Your documents are encrypted and securely stored. We use them only for identity verification.
                </p>
            </div>

            {uploadedDocs.length >= 5 && (
                <p className="text-xs text-amber-600 text-center">
                    Maximum 5 documents reached
                </p>
            )}
        </div>
    );
};
