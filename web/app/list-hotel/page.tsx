'use client';

import { useState, useEffect } from 'react';

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Basic Info', 'Property Details', 'Token Settings'];
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <div key={index} className="flex-1 text-center">
                        <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep > index + 1 ? 'bg-green-500' : currentStep === index + 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                            {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        <p className={`mt-2 text-sm ${currentStep >= index + 1 ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                    </div>
                ))}
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            // NOTE: File objects cannot be stored in localStorage directly.
            // In a real app, you would upload them and store the URLs.
            const { images, ...submissionData } = formData;
            submittedApps.push(submissionData);
            localStorage.setItem('submittedApplications', JSON.stringify(submittedApps));
            
            // Clear form and draft
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
            <div className="container mx-auto p-4 max-w-3xl text-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <h2 className="text-2xl font-bold">Application Submitted!</h2>
                    <p className="mt-2">Thank you for your submission. We will review your application within 48 hours.</p>
                    <button onClick={() => setIsSubmitted(false)} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Submit Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">List Your Property</h1>
            <div className="bg-white shadow-md rounded-lg p-8">
                <ProgressIndicator currentStep={step} />

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-4">
                        <InputField label="Hotel Name" name="hotelName" value={formData.hotelName} onChange={handleChange} error={errors.hotelName} required />
                        <TextareaField label="Hotel Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} maxLength={500} required />
                        <InputField label="Location / Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} required />
                        <InputField label="Website URL" name="website" value={formData.website} onChange={handleChange} error={errors.website} />
                        <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                        <InputField label="Contact Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    </div>
                )}

                {/* Step 2: Property Details */}
                {step === 2 && (
                    <div className="space-y-4">
                        <SelectField label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleChange} options={['Hotel', 'Resort', 'Boutique', 'Hostel']} />
                        <InputField label="Number of Rooms" name="roomCount" type="number" value={formData.roomCount} onChange={handleChange} error={errors.roomCount} required />
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Hotel Images (Max 3)</label>
                            <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                        </div>
                    </div>
                )}

                {/* Step 3: Token Settings */}
                {step === 3 && (
                    <div className="space-y-4">
                        <InputField label="Membership Token Supply" name="tokenSupply" type="number" value={formData.tokenSupply} onChange={handleChange} error={errors.tokenSupply} required />
                        <InputField label="Minting Price (SOL)" name="mintPrice" type="number" value={formData.mintPrice} onChange={handleChange} error={errors.mintPrice} required />
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between items-center">
                    <div>
                        {step > 1 && <button onClick={prevStep} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">Back</button>}
                    </div>
                    <div className="space-x-4">
                        <button onClick={handleSaveDraft} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">Save Draft</button>
                        {step < 3 && <button onClick={nextStep} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Next</button>}
                        {step === 3 && <button onClick={handleSubmit} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Submit Application</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components for form fields
const InputField = ({ label, name, type = 'text', value, onChange, error, required = false }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className={`mt-1 w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const TextareaField = ({ label, name, value, onChange, error, maxLength, required = false }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label} {required && <span className="text-red-500">*</span>}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={4} maxLength={maxLength} className={`mt-1 w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black`}></textarea>
        <div className="text-right text-xs text-gray-500">{value.length}/{maxLength}</div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const SelectField = ({ label, name, value, onChange, options }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-black">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
