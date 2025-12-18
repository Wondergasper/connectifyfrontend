import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState, useRef, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface FileUploadProps {
    onUploadSuccess?: (url: string) => void;
    onUploadError?: (error: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    type: 'profile' | 'portfolio' | 'verification';
    multiple?: boolean;
}

export const useFileUpload = (type: 'profile' | 'portfolio' | 'verification') => {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadMutation = useMutation({
        mutationFn: async (files: File[]) => {
            setUploading(true);
            setProgress(0);

            try {
                let result;
                if (type === 'profile' && files.length > 0) {
                    result = await api.upload.profileImage(files[0]);
                } else if (type === 'portfolio') {
                    result = await api.upload.portfolio(files);
                } else if (type === 'verification') {
                    result = await api.upload.verification(files);
                }

                setProgress(100);
                return result;
            } finally {
                setTimeout(() => {
                    setUploading(false);
                    setProgress(0);
                }, 500);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Upload successful!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Upload failed');
        }
    });

    const handleUpload = async (files: File[]) => {
        return uploadMutation.mutateAsync(files);
    };

    return {
        upload: handleUpload,
        uploading,
        progress,
        isSuccess: uploadMutation.isSuccess,
        error: uploadMutation.error
    };
};

export const useImageUpload = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, callback?: (file: File) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Call callback with file
            if (callback) {
                callback(file);
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const clearPreview = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return {
        fileInputRef,
        preview,
        handleFileSelect,
        triggerFileInput,
        clearPreview
    };
};
