'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

import { useUser } from '@/hooks/useUser';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/mode-toggle';
import TextCustomizer from '@/components/editor/text-customizer';

import { PlusIcon } from '@radix-ui/react-icons';

import { removeBackground } from "@imgly/background-removal";

import '@/app/fonts.css';

const Page = () => {
    const { user } = useUser();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
    const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
    const [processingMessage, setProcessingMessage] = useState<string>('');
    const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUploadImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setIsProcessingImage(true);
            setProcessingMessage('Uploading image...');
            await setupImage(imageUrl);
        }
    };

    const setupImage = async (imageUrl: string) => {
        try {
            setProcessingMessage('Removing background... This may take 10-30 seconds for high quality results');
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
            setProcessingMessage('Background removed successfully! You can now add text.');
            setTimeout(() => {
                setIsProcessingImage(false);
                setProcessingMessage('');
            }, 2000);
        } catch (error) {
            setProcessingMessage('Failed to remove background. You can still add text to your image.');
            setTimeout(() => {
                setIsProcessingImage(false);
                setProcessingMessage('');
            }, 3000);
        }
    };

    const addNewTextSet = () => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: 'edit',
            fontFamily: 'Inter',
            top: 0,
            left: 0,
            color: 'white',
            fontSize: 200,
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0,
            tiltX: 0,
            tiltY: 0,
            letterSpacing: 0
        }]);
    };

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set => 
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    };

    const duplicateTextSet = (textSet: any) => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    const handleEditMoreImages = () => {
        // Reset all states to start fresh
        setSelectedImage(null);
        setIsImageSetupDone(false);
        setRemovedBgImageUrl(null);
        setTextSets([]);
        setIsProcessingImage(false);
        setIsSavingImage(false);
        setProcessingMessage('');
        setShowDonationModal(false);
        
        // Trigger file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone) return;
        
        setIsSavingImage(true);
        setProcessingMessage('Preparing your image for download...');
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const bgImg = new (window as any).Image();
        bgImg.crossOrigin = "anonymous";
        
        const triggerDownload = () => {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'text-behind-image.png';
            link.href = dataUrl;
            link.click();
            
            setProcessingMessage('Image downloaded successfully!');
            setTimeout(() => {
                setIsSavingImage(false);
                setProcessingMessage('');
                setShowDonationModal(true);
            }, 2000);
        };
        
        const drawForegroundAndDownload = () => {
            // Draw the removed background image on top if available
            if (removedBgImageUrl) {
                const fgImg = new (window as any).Image();
                fgImg.crossOrigin = "anonymous";
                fgImg.onload = () => {
                    ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
                    triggerDownload();
                };
                fgImg.onerror = () => {
                    setProcessingMessage('Compositing layers...');
                    triggerDownload();
                };
                fgImg.src = removedBgImageUrl;
            } else {
                // No foreground image, trigger download immediately
                triggerDownload();
            }
        };
        
        bgImg.onload = () => {
            canvas.width = bgImg.width;
            canvas.height = bgImg.height;
    
            // Calculate the scaling factor between original image and preview display
            // Preview container is 400px height, and image uses objectFit="contain"
            const previewContainerHeight = 400;
            const imageAspectRatio = bgImg.width / bgImg.height;
            
            // Calculate actual displayed size in preview (considering objectFit="contain")
            let previewDisplayHeight, previewDisplayWidth;
            if (imageAspectRatio > 1) {
                // Wide image - height will be constrained
                previewDisplayHeight = Math.min(previewContainerHeight, bgImg.height);
                previewDisplayWidth = previewDisplayHeight * imageAspectRatio;
            } else {
                // Tall image - height will be constrained to container
                previewDisplayHeight = previewContainerHeight;
                previewDisplayWidth = previewDisplayHeight * imageAspectRatio;
            }
            
            // Scale factor: how much bigger the original is compared to preview
            const scaleFactor = bgImg.height / previewDisplayHeight;
    
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    
            textSets.forEach(textSet => {
                ctx.save();
                
                // Set up text properties with proper scaling
                const scaledFontSize = (textSet.fontSize / 10) * scaleFactor;
                const scaledLetterSpacing = (textSet.letterSpacing / 10) * scaleFactor;
                const scaledShadowSize = (textSet.shadowSize / 10) * scaleFactor;
                
                ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.letterSpacing = `${scaledLetterSpacing}px`;
                
                // Add text shadow to match preview
                ctx.shadowColor = textSet.shadowColor;
                ctx.shadowOffsetX = scaledShadowSize;
                ctx.shadowOffsetY = scaledShadowSize;
                ctx.shadowBlur = scaledShadowSize * 2;
    
                const x = canvas.width * (textSet.left + 50) / 100;
                const y = canvas.height * (50 - textSet.top) / 100;
    
                // Move to position first
                ctx.translate(x, y);
                
                // Apply 3D transforms
                const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
                const tiltYRad = (-textSet.tiltY * Math.PI) / 180;
    
                // Use a simpler transform that maintains the visual tilt
                ctx.transform(
                    Math.cos(tiltYRad),
                    Math.sin(0),
                    -Math.sin(0),
                    Math.cos(tiltXRad),
                    0,
                    0
                );
    
                // Apply rotation last
                ctx.rotate((textSet.rotation * Math.PI) / 180);
    
                if (textSet.letterSpacing === 0) {
                    // Use standard text rendering if no letter spacing
                    ctx.fillText(textSet.text, 0, 0);
                } else {
                    // Manual letter spacing implementation
                    const chars = textSet.text.split('');
                    let currentX = 0;
                    // Calculate total width to center properly (use the already calculated scaledLetterSpacing)
                    const totalWidth = chars.reduce((width, char, i) => {
                        const charWidth = ctx.measureText(char).width;
                        return width + charWidth + (i < chars.length - 1 ? scaledLetterSpacing : 0);
                    }, 0);
                    
                    const startX = -totalWidth / 2;
                    currentX = startX;
                    
                    chars.forEach((char, i) => {
                        ctx.fillText(char, currentX, 0);
                        const charWidth = ctx.measureText(char).width;
                        currentX += charWidth + (i < chars.length - 1 ? scaledLetterSpacing : 0);
                    });
                }
    
                ctx.restore();
            });
    
            drawForegroundAndDownload();
        };
        
        bgImg.onerror = () => {
            setProcessingMessage('Failed to process image. Please try again.');
            setTimeout(() => {
                setIsSavingImage(false);
                setProcessingMessage('');
            }, 3000);
        };
        
        bgImg.src = selectedImage || '';
    };
    
    return (
        <div className='flex flex-col h-screen'>
            <header className="flex items-center justify-between p-6 border-b">
                <div className='flex items-center gap-5'>
                    <h1 className="text-2xl font-bold">Text Behind Image</h1>
                </div>
                <div className='flex items-center gap-5'>
                    <div className='flex gap-2'>
                        <Button onClick={handleUploadImage}>
                            Upload image
                        </Button>
                        {selectedImage && (
                            <>
                                <Button 
                                    onClick={saveCompositeImage} 
                                    className='hidden md:flex'
                                    disabled={isSavingImage || isProcessingImage}
                                >
                                    {isSavingImage ? 'Saving...' : 'Save image'}
                                </Button>
                                <Button 
                                    onClick={handleEditMoreImages}
                                    variant="outline"
                                    className='hidden md:flex'
                                >
                                    Edit More Images
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <ModeToggle />
            </header>
            <Separator /> 
            
            <div className='flex flex-col md:flex-row items-start justify-start gap-10 w-full h-screen px-10 mt-2'>
                <div className="flex flex-col items-start justify-start w-full md:w-1/2 gap-4">
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className='flex items-center gap-2'>
                        <Button 
                            onClick={saveCompositeImage} 
                            className='md:hidden'
                            disabled={isSavingImage || isProcessingImage}
                        >
                            {isSavingImage ? 'Saving...' : 'Save image'}
                        </Button>
                        {selectedImage && (
                            <Button 
                                onClick={handleEditMoreImages}
                                variant="outline"
                                className='md:hidden'
                            >
                                Edit More Images
                            </Button>
                        )}
                    </div>
                    
                    {/* Status Messages */}
                    {(isProcessingImage || isSavingImage || processingMessage) && (
                        <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center gap-2">
                                {(isProcessingImage || isSavingImage) && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                )}
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    {processingMessage || 'Processing...'}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Selected"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="center"
                                className="absolute top-0 left-0 w-full h-full z-10"
                            />
                        )}
                        
                        {textSets.map((textSet) => (
                            <div
                                key={textSet.id}
                                className="absolute text-center select-none pointer-events-none z-20"
                                style={{
                                    top: `${50 - textSet.top}%`,
                                    left: `${textSet.left + 50}%`,
                                    transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg) perspective(1000px) rotateX(${textSet.tiltX}deg) rotateY(${textSet.tiltY}deg)`,
                                    fontSize: `${textSet.fontSize / 10}px`,
                                    fontFamily: textSet.fontFamily,
                                    color: textSet.color,
                                    fontWeight: textSet.fontWeight,
                                    opacity: textSet.opacity,
                                    textShadow: `${textSet.shadowSize / 10}px ${textSet.shadowSize / 10}px ${(textSet.shadowSize * 2) / 10}px ${textSet.shadowColor}`,
                                    letterSpacing: `${textSet.letterSpacing / 10}px`,
                                }}
                            >
                                {textSet.text}
                            </div>
                        ))}

                        {removedBgImageUrl && (
                            <Image
                                src={removedBgImageUrl}
                                alt="Removed bg"
                                layout="fill"
                                objectFit="contain" 
                                objectPosition="center" 
                                className="absolute top-0 left-0 w-full h-full z-30"
                            /> 
                        )}
                    </div>
                </div>
                            
                <div className="w-full md:w-1/2 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Text Layers</h2>
                        <Button onClick={addNewTextSet} size="sm">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Text
                        </Button>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <Accordion type="single" collapsible className="space-y-2">
                            {textSets.map((textSet) => (
                                <TextCustomizer
                                    key={textSet.id}
                                    textSet={textSet}
                                    handleAttributeChange={handleAttributeChange}
                                    removeTextSet={removeTextSet}
                                    duplicateTextSet={duplicateTextSet}
                                    userId={user?.id || 'free-user'}
                                />
                            ))}
                        </Accordion>
                    </ScrollArea>
                </div>
            </div>

            {/* Donation Modal */}
            <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Support This Tool</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <p className="text-center text-sm text-muted-foreground">
                            If you found this tool helpful, consider supporting its development.
                        </p>
                        
                        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            <Image
                                src="https://res.cloudinary.com/dtmo3evjx/image/upload/c_crop,ar_4:3/v1748877982/WhatsApp_Image_2025-06-02_at_20.41.51_f6994f29_qsyejy.jpg"
                                alt="Donation QR Code"
                                width={250}
                                height={250}
                                className="rounded"
                            />
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground">
                            Scan to donate
                        </p>
                    </div>
                    
                    <DialogFooter className="flex flex-col sm:flex-row gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDonationModal(false)}
                            className="w-full"
                        >
                            Continue Using Tool
                        </Button>
                        <Button 
                            onClick={() => setShowDonationModal(false)}
                            className="w-full"
                        >
                            Thank You / Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Page;