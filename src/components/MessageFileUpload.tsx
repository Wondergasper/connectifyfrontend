// File Upload Component for Messages
import { Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    selectedFiles: File[];
    onRemoveFile: (index: number) => void;
    uploading?: boolean;
}

export const MessageFileUpload = ({ onFilesSelected, selectedFiles, onRemoveFile, uploading }: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        onFilesSelected(files);
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) {
            return <ImageIcon className="w-4 h-4" />;
        }
        return <FileText className="w-4 h-4" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div>
            {/* File Upload Button */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                title="Attach file"
            >
                <Paperclip className="w-5 h-5 text-foreground" />
            </button>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 p-4 bg-background border-t border-border">
                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-card rounded-lg border border-border">
                                <div className="flex-shrink-0 p-2 bg-primary/10 rounded">
                                    {getFileIcon(file)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    onClick={() => onRemoveFile(index)}
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
