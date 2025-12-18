import React from "react";
import { Camera, Upload, X } from "lucide-react";
import { useImageUpload, useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    currentImage?: string;
    onUploadSuccess?: (url: string) => void;
    className?: string;
    type?: 'profile' | 'portfolio';
    shape?: 'circle' | 'square';
}

export const ImageUpload = ({
    currentImage,
    onUploadSuccess,
    className,
    type = 'profile',
    shape = 'circle'
}: ImageUploadProps) => {
    const { fileInputRef, preview, handleFileSelect, triggerFileInput, clearPreview } = useImageUpload();
    const { upload, uploading } = useFileUpload(type);

    const handleUploadClick = async (file: File) => {
        try {
            const result = await upload([file]);
            if (result?.data?.url && onUploadSuccess) {
                onUploadSuccess(result.data.url);
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const displayImage = preview || currentImage || "https://github.com/shadcn.png";

    return (
        <div className={cn("relative inline-block", className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, handleUploadClick)}
            />

            <div
                className={cn(
                    "relative group cursor-pointer overflow-hidden border-4 border-card shadow-medium",
                    shape === 'circle' ? 'rounded-full' : 'rounded-2xl',
                    uploading && 'opacity-50'
                )}
                onClick={triggerFileInput}
            >
                <img
                    src={displayImage}
                    alt="Upload"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    {uploading ? (
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Camera className="w-8 h-8 text-white" />
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className={cn(
                    "absolute bottom-0 right-0 w-9 h-9 flex items-center justify-center shadow-medium hover:scale-110 transition-smooth border-2 border-card",
                    shape === 'circle' ? 'rounded-full' : 'rounded-lg',
                    "bg-primary text-white disabled:opacity-50"
                )}
            >
                <Camera className="w-4 h-4" />
            </button>
        </div>
    );
};

interface MultiImageUploadProps {
    images?: string[];
    onUploadSuccess?: (urls: string[]) => void;
    maxImages?: number;
    type: 'portfolio' | 'verification';
}

export const MultiImageUpload = ({
    images = [],
    onUploadSuccess,
    maxImages = 10,
    type
}: MultiImageUploadProps) => {
    const { upload, uploading } = useFileUpload(type);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        // Validate
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/') && type !== 'verification') {
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            return;
        }

        if (images.length + validFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        try {
            const result = await upload(validFiles);
            if (result?.data?.urls && onUploadSuccess) {
                onUploadSuccess(result.data.urls);
            }
        } catch (error) {
            console.error('Upload error:', error);
        }

        // Reset input
        e.target.value = '';
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded-2xl overflow-hidden border-2 border-border bg-muted relative group"
                    >
                        <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {images.length < maxImages && (
                    <>
                        {[...Array(Math.min(4 - images.length, maxImages - images.length))].map((_, index) => (
                            <label
                                key={`empty-${index}`}
                                className="aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-smooth flex flex-col items-center justify-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept={type === 'verification' ? 'image/*,application/pdf' : 'image/*'}
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Add {type === 'portfolio' ? 'Photo' : 'Document'}</span>
                                    </>
                                )}
                            </label>
                        ))}
                    </>
                )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
                {images.length} / {maxImages} {type === 'portfolio' ? 'photos' : 'documents'} uploaded
            </p>
        </div>
    );
};
