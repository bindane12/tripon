'use client';

import { useState, useEffect, FC, ChangeEvent } from 'react';

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Basic Info', 'Property Details', 'Token Settings'];
    return (
        <div className="mb-12">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <div key={index} className="flex-1 text-center">
                        <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 ${currentStep > index + 1 ? 'bg-primary border-primary' : currentStep === index + 1 ? 'bg-primary border-primary' : 'bg-white border-border'}`}>
                            {currentStep > index + 1 ? '✓' : <span className={currentStep === index + 1 ? 'text-white' : 'text-muted-foreground'}>{index + 1}</span>}
                        </div>
                        <p className={`mt-2 text-sm font-semibold ${currentStep >= index + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
                    </div>
                ))}
            </div>
            <div className="bg-border h-1 w-full mt-4">
                <div className="bg-primary h-1" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, transition: 'width 0.3s' }}></div>
            </div>
        </div>
    );
};

export default function ListHotelPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        hotelName: '',
        description: '',
        address: '',
        website: '',
        email: '',
        phone: '',
        propertyType: 'Hotel',
        roomCount: '',
        images: {},
        tokenSupply: '10000',
        mintPrice: '0.01',
    });
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Load draft from localStorage on initial render
    useEffect(() => {
        const draft = localStorage.getItem('hotelDraft');
        if (draft) {
            setFormData(JSON.parse(draft));
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 3) {
                setErrors({ ...errors, images: 'You can upload a maximum of 3 images.' });
                return;
            } else {
                const newErrors = { ...errors };
                delete newErrors.images;
                setErrors(newErrors);
            }
            setFormData({ ...formData, images: files || {} });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateStep = () => {
        const newErrors: any = {};
        if (step === 1) {
            if (!formData.hotelName) newErrors.hotelName = 'Hotel name is required.';
            if (!formData.description) newErrors.description = 'Description is required.';
            if (formData.description.length > 500) newErrors.description = 'Description cannot exceed 500 characters.';
            if (!formData.address) newErrors.address = 'Address is required.';
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'A valid email is required.';
        } else if (step === 2) {
            if (!formData.roomCount || parseInt(formData.roomCount) <= 0) newErrors.roomCount = 'Please enter a valid number of rooms.';
        } else if (step === 3) {
            if (!formData.tokenSupply || parseInt(formData.tokenSupply) <= 0) newErrors.tokenSupply = 'Token supply must be greater than 0.';
            if (!formData.mintPrice || parseFloat(formData.mintPrice) <= 0) newErrors.mintPrice = 'Minting price must be greater than 0.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const handleSaveDraft = () => {
        localStorage.setItem('hotelDraft', JSON.stringify(formData));
        alert('Draft saved!');
    };

    const handleSubmit = () => {
        if (validateStep()) {
            const submittedApps = JSON.parse(localStorage.getItem('submittedApplications') || '[]');
            const { images, ...submissionData } = formData;
            submittedApps.push(submissionData);
            localStorage.setItem('submittedApplications', JSON.stringify(submittedApps));
            
            setFormData({
                hotelName: '', description: '', address: '', website: '', email: '', phone: '',
                propertyType: 'Hotel', roomCount: '', images: {}, tokenSupply: '10000', mintPrice: '0.01',
            });
            localStorage.removeItem('hotelDraft');
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <div className="container mx-auto p-4 max-w-2xl text-center">
                    <div className="bg-card border border-green-200 text-green-800 px-6 py-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold">Application Submitted!</h2>
                        <p className="mt-3 text-green-700">Thank you for your submission. We will review your application within 48 hours.</p>
                        <button onClick={() => setIsSubmitted(false)} className="mt-6 bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/90">Submit Another</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted">
            <div className="container mx-auto p-4 max-w-3xl py-12">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-foreground">Become a Partner</h1>
                    <p className="text-muted-foreground mt-2">Follow the steps below to get your property listed on TripOn.</p>
                </header>
                <div className="bg-card shadow-xl rounded-2xl p-8 border border-border">
                    <ProgressIndicator currentStep={step} />

                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Hotel Name" name="hotelName" value={formData.hotelName} onChange={handleChange} error={errors.hotelName} required />
                            <InputField label="Website URL" name="website" value={formData.website} onChange={handleChange} error={errors.website} />
                            <div className="md:col-span-2">
                                <TextareaField label="Hotel Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} maxLength={500} required />
                            </div>
                            <div className="md:col-span-2">
                                <InputField label="Location / Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} required />
                            </div>
                            <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                            <InputField label="Contact Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleChange} options={['Hotel', 'Resort', 'Boutique', 'Hostel']} />
                            <InputField label="Number of Rooms" name="roomCount" type="number" value={formData.roomCount} onChange={handleChange} error={errors.roomCount} required />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground">Hotel Images (Max 3)</label>
                                <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="mt-2 w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Membership Token Supply" name="tokenSupply" type="number" value={formData.tokenSupply} onChange={handleChange} error={errors.tokenSupply} required />
                            <InputField label="Minting Price (SOL)" name="mintPrice" type="number" value={formData.mintPrice} onChange={handleChange} error={errors.mintPrice} required />
                        </div>
                    )}

                    <div className="mt-10 flex justify-between items-center">
                        <div>
                            {step > 1 && <Button onClick={prevStep} variant="secondary">Back</Button>}
                        </div>
                        <div className="space-x-4">
                            <Button onClick={handleSaveDraft} variant="outline">Save Draft</Button>
                            {step < 3 && <Button onClick={nextStep}>Next</Button>}
                            {step === 3 && <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">Submit Application</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Form Field Components ---

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

const InputField: FC<InputFieldProps> = ({ label, name, type = 'text', value, onChange, error, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className={`mt-1 w-full px-4 py-3 bg-background border ${error ? 'border-red-500' : 'border-border'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

interface TextareaFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    maxLength?: number;
    required?: boolean;
}

const TextareaField: FC<TextareaFieldProps> = ({ label, name, value, onChange, error, maxLength, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label} {required && <span className="text-red-500">*</span>}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={4} maxLength={maxLength} className={`mt-1 w-full px-4 py-3 bg-background border ${error ? 'border-red-500' : 'border-border'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground`}></textarea>
        {maxLength && <div className="text-right text-xs text-muted-foreground">{value.length}/{maxLength}</div>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

const SelectField: FC<SelectFieldProps> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full pl-4 pr-10 py-3 text-base border-border focus:outline-none focus:ring-primary/50 focus:border-primary/50 sm:text-sm rounded-lg text-foreground bg-background">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
}

const Button: FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
    const baseClasses = "py-2.5 px-6 rounded-lg font-semibold transition-colors shadow-sm";
    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-muted text-muted-foreground hover:bg-muted/80',
        outline: 'bg-transparent border border-border text-foreground hover:bg-muted'
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};