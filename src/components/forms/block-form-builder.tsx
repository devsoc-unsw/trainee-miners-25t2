"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { type TemplateBlock } from "~/lib/template-blocks";
import { type FormTemplate, getTemplateBlocks } from "~/lib/form-templates";
import { TemplateBlockSelector } from "./template-block-selector";
import { CreateCustomBlockModal } from "./create-custom-block-modal";
import { api } from "~/trpc/react";
import {
    Eye,
    Settings,
    X,
    Trash2,
} from "lucide-react";

interface BlockFormBuilderProps {
    onSave: (formData: { title: string; description: string; blocks: TemplateBlock[] }) => void;
    onCancel: () => void;
    isSaving?: boolean;
    initialTemplate?: FormTemplate;
}

export function BlockFormBuilder({ onSave, onCancel, isSaving = false, initialTemplate }: BlockFormBuilderProps) {
    const [formTitle, setFormTitle] = useState('My form');
    const [formDescription, setFormDescription] = useState('');
    const [selectedBlocks, setSelectedBlocks] = useState<TemplateBlock[]>([]);
    const [isPreview, setIsPreview] = useState(false);
    const [isCustomBlockModalOpen, setIsCustomBlockModalOpen] = useState(false);

    const utils = api.useContext();

    // Effect to load initial template
    useEffect(() => {
        if (initialTemplate) {
            setFormTitle(initialTemplate.name);
            setFormDescription(initialTemplate.description);

            // Load template blocks
            const templateBlocks = getTemplateBlocks(initialTemplate);
            const blocksWithUniqueIds = templateBlocks.map(block => ({
                ...block,
                id: `${block.id}-${Date.now()}-${Math.random()}`, // Make unique for this form instance
            }));
            setSelectedBlocks(blocksWithUniqueIds);

            // If template has additional fields, create a custom block for them
            if (initialTemplate.additionalFields && initialTemplate.additionalFields.length > 0) {
                const additionalFieldsBlock: TemplateBlock = {
                    id: `additional-fields-${Date.now()}`,
                    name: 'Additional Fields',
                    description: 'Template-specific fields',
                    category: 'Custom',
                    fields: initialTemplate.additionalFields,
                    isCustom: true,
                };
                setSelectedBlocks(prev => [...prev, additionalFieldsBlock]);
            }
        }
    }, [initialTemplate]);

    const createTemplateBlockMutation = api.templateBlock.create.useMutation({
        onSuccess: (data) => {
            // Convert the saved block back to TemplateBlock format and add to selected blocks
            const newBlock: TemplateBlock = {
                id: data.id,
                name: data.name,
                description: data.description || undefined,
                category: data.category,
                fields: data.fields as any[], // Type assertion since we know the structure
                isCustom: data.isCustom,
                createdAt: data.createdAt,
            };
            handleSelectBlock(newBlock);
            // Invalidate template blocks query to refresh the list
            void utils.templateBlock.getAll.invalidate();
        },
        onError: (error) => {
            alert(`Error creating custom block: ${error.message}`);
        },
    });

    const handleSelectBlock = (block: TemplateBlock) => {
        // Create a unique instance of the block for the form
        const blockInstance = {
            ...block,
            id: `${block.id}-${Date.now()}`, // Make it unique for this form instance
        };
        setSelectedBlocks([...selectedBlocks, blockInstance]);
    };

    const handleRemoveBlock = (blockId: string) => {
        setSelectedBlocks(selectedBlocks.filter(block => block.id !== blockId));
    };

    const handleCreateCustomBlock = (blockData: Omit<TemplateBlock, 'id' | 'createdAt'>) => {
        createTemplateBlockMutation.mutate({
            name: blockData.name,
            description: blockData.description ?? undefined,
            category: blockData.category,
            fields: blockData.fields,
            isCustom: blockData.isCustom,
            isPublic: false, // Default custom blocks to private
        });
    };

    const handleSave = () => {
        if (!formTitle.trim()) {
            alert('Please enter a form title');
            return;
        }
        if (selectedBlocks.length === 0) {
            alert('Please add at least one template block');
            return;
        }

        onSave({
            title: formTitle,
            description: formDescription,
            blocks: selectedBlocks,
        });
    };

    const renderFormPreview = () => (
        <div className="space-y-6">
            {/* Form Header */}
            <div className="text-center border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{formTitle}</h2>
                {formDescription && (
                    <p className="text-gray-600">{formDescription}</p>
                )}
            </div>

            {/* Form Blocks */}
            <div className="space-y-8">
                {selectedBlocks.map((block, blockIndex) => (
                    <Card key={block.id} className="p-6">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">{block.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {block.fields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <label className="block font-medium text-gray-700">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            className="w-full p-3 border rounded-md bg-gray-50"
                                            placeholder={field.placeholder}
                                            rows={3}
                                            disabled
                                        />
                                    ) : field.type === 'select' ? (
                                        <select className="w-full p-3 border rounded-md bg-gray-50" disabled>
                                            <option>{field.placeholder || 'Select an option'}</option>
                                            {field.options?.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'radio' ? (
                                        <div className="space-y-2">
                                            {field.options?.map((option, idx) => (
                                                <label key={idx} className="flex items-center gap-2">
                                                    <input type="radio" name={`${block.id}-${field.id}`} disabled />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : field.type === 'checkbox' ? (
                                        <div className="space-y-2">
                                            {field.options?.map((option, idx) => (
                                                <label key={idx} className="flex items-center gap-2">
                                                    <input type="checkbox" disabled />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <Input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="text-center pt-6">
                <Button className="w-full md:w-auto px-8 py-3" disabled>
                    Submit Form
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Create New Form</h1>
                    <p className="text-gray-600">Build your form using template blocks</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        {isPreview ? 'Edit' : 'Preview'}
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Form'}
                    </Button>
                </div>
            </div>

            {isPreview ? (
                <Card className="p-6">
                    {renderFormPreview()}
                </Card>
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Panel - Form Preview */}
                    <div className="col-span-7">
                        <Card className="p-4 mb-4">
                            <h3 className="font-semibold mb-3">Form Name</h3>
                            <Input
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="Enter form title"
                                className="mb-3"
                            />
                        </Card>

                        <div className="sticky top-4">
                            <h3 className="font-semibold mb-3">Form Preview</h3>
                            <Card className="p-6 min-h-[600px]">
                                {selectedBlocks.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Settings className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-gray-500">Select template blocks to build your form</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h4 className="text-xl font-bold text-gray-900">{formTitle}</h4>
                                            {formDescription && (
                                                <p className="text-gray-600 mt-1">{formDescription}</p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {selectedBlocks.map((block) => (
                                                <Card key={block.id} className="p-4 bg-blue-50 border-blue-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-semibold text-blue-700">{block.name}</h5>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveBlock(block.id)}
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {block.fields.map((field, idx) => (
                                                            <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">
                                                                {field.label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>

                    {/* Right Panel - Form Structure & Template Blocks */}
                    <div className="col-span-5">
                        {/* Form Structure */}
                        <Card className="p-4 mb-4">
                            <h3 className="font-semibold mb-3">Form Structure</h3>
                            {selectedBlocks.length === 0 ? (
                                <p className="text-gray-500 text-sm">No blocks selected</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedBlocks.map((block, index) => (
                                        <div key={block.id} className="flex items-center justify-between bg-blue-50 p-3 rounded border">
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600 font-semibold text-sm">{block.name}</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {block.fields.slice(0, 3).map((field, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                                                            {field.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveBlock(block.id)}
                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Template Block Selector */}
                        <TemplateBlockSelector
                            onSelectBlock={handleSelectBlock}
                            onCreateCustomBlock={() => setIsCustomBlockModalOpen(true)}
                            selectedBlocks={selectedBlocks}
                            onRemoveBlock={handleRemoveBlock}
                        />
                    </div>
                </div>
            )}

            {/* Custom Block Modal */}
            <CreateCustomBlockModal
                isOpen={isCustomBlockModalOpen}
                onClose={() => setIsCustomBlockModalOpen(false)}
                onSave={handleCreateCustomBlock}
            />
        </div>
    );
}
