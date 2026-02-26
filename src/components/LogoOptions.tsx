import React, { useRef, useState } from 'react';
import { QRCodeOptions } from '../types/qr';
import { Link, Type, Mail, Phone, Wifi, User, Upload, X } from 'lucide-react';

interface LogoOptionsProps {
    options: QRCodeOptions;
    onChange: (options: QRCodeOptions) => void;
    t: (key: string) => string;
}

export const LogoOptions: React.FC<LogoOptionsProps> = ({ options, onChange, t }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Predefined icons using Lucide React components rendered as images
    // Since we can't easily convert React components to images for the canvas, 
    // we'll use a path approach or base64 placeholder.
    // For simplicity and robustness with the current QR generator logic which expects an image source URL,
    // we will use public assets if available, or generate them on the fly if possible.
    // However, the user request specifically asked for specific icons.
    // I will use simple SVG data URIs for these standard icons.

    const getSvgDataUri = (iconName: string, color: string = 'black') => {
        // Simplified SVG strings for standard icons
        const icons: Record<string, string> = {
            link: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
            text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
            email: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`,
            phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
            wifi: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`,
            contact: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        };
        return `data:image/svg+xml;base64,${btoa(icons[iconName] || '')}`;
    };

    const handleIconSelect = (iconName: string) => {
        // Set predefined icon
        const dataUri = getSvgDataUri(iconName, options.foregroundColor);
        onChange({ ...options, logo: dataUri });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
                onChange({ ...options, logo: event.target.result });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const removeLogo = () => {
        onChange({ ...options, logo: undefined });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {t('logoOptionsTitle')}
            </h3>

            <div className="space-y-4">
                {/* Predefined Icons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                        { name: 'link', icon: Link },
                        { name: 'text', icon: Type },
                        { name: 'email', icon: Mail },
                        { name: 'phone', icon: Phone },
                        { name: 'wifi', icon: Wifi },
                        { name: 'contact', icon: User },
                    ].map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => handleIconSelect(name)}
                            className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center group"
                            title={name}
                        >
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-orange-400" />
                        </button>
                    ))}
                </div>

                {/* Drag and Drop Area */}
                <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${isDragging
                        ? 'border-purple-500 bg-purple-50 dark:bg-gray-700'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {options.logo ? (
                        <div className="relative inline-block">
                            <img
                                src={options.logo}
                                alt="Selected logo"
                                className="h-16 w-16 object-contain rounded-lg mx-auto"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeLogo();
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                                title={t('removeLogo')}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2 cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('dragAndDrop')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
