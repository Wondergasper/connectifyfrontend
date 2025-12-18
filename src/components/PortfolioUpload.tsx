import { useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface PortfolioUploadProps {
    userId?: string;
    currentImages?: Array<{ url: string; publicId: string; _id?: string }>;
    maxImages?: number;
    onUploadComplete?: () => void;
}

export const PortfolioUpload = ({
    userId,
    currentImages = [],
    maxImages = 10,
    onUploadComplete
}: PortfolioUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) return;

        if (currentImages.length + files.length > maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Validate files
        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

            if (!isImage) {
                toast.error(`${file.name} is not an image`);
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
            const response = await api.upload.portfolio(validFiles);

            toast.success(`${validFiles.length} image(s) uploaded successfully!`);

            // Invalidate profile query to refetch
            queryClient.invalidateQueries({ queryKey: ['profile'] });

            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error) {
            console.error('Portfolio upload error:', error);
            toast.error('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleDeleteImage = async (publicId: string, imageId?: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setDeleting(imageId || publicId);

        try {
            await api.upload.deletePortfolioImage(publicId);

            toast.success('Image deleted successfully!');

            // Invalidate profile query to refetch
            queryClient.invalidateQueries({ queryKey: ['profile'] });

            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error) {
            console.error('Delete image error:', error);
            toast.error('Failed to delete image. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                {/* Existing Images */}
                {currentImages.map((image, index) => (
                    <div
                        key={image._id || image.publicId || index}
                        className="relative aspect-square rounded-2xl bg-gradient-card border border-border overflow-hidden group"
                    >
                        <img
                            src={image.url}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Delete Button */}
                        <button
                            onClick={() => handleDeleteImage(image.publicId, image._id)}
                            disabled={deleting === (image._id || image.publicId)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-medium hover:bg-red-600 disabled:opacity-50"
                        >
                            {deleting === (image._id || image.publicId) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <X className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                ))}

                {/* Add Photos Button */}
                {currentImages.length < maxImages && (
                    <label className="aspect-square rounded-2xl bg-gradient-card border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="hidden"
                        />
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                <span className="text-xs text-muted-foreground">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Camera className="w-8 h-8 text-primary mb-2" />
                                <span className="text-xs text-muted-foreground font-medium">Add Photos</span>
                                <span className="text-[10px] text-muted-foreground mt-1">
                                    {currentImages.length}/{maxImages}
                                </span>
                            </>
                        )}
                    </label>
                )}

                {/* Empty Placeholders */}
                {currentImages.length === 0 && !uploading && (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-2xl bg-gradient-card border border-border flex items-center justify-center text-4xl opacity-30"
                        >
                            🏠
                        </div>
                    ))
                )}
            </div>

            {currentImages.length >= maxImages && (
                <p className="text-xs text-amber-600 text-center">
                    Maximum {maxImages} images reached. Delete some to add more.
                </p>
            )}
        </div>
    );
};
