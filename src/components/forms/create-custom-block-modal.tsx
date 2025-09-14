"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { type TemplateBlock, type FormField, blockCategories } from "~/lib/template-blocks";
import {
    X,
    Plus,
    Trash2,
    Type,
    Mail,
    Hash,
    Calendar,
    List,
    CheckSquare,
    Circle,
    FileText
} from "lucide-react";

const fieldTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'textarea', label: 'Textarea', icon: FileText },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'radio', label: 'Radio Buttons', icon: Circle },
    { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
    { value: 'date', label: 'Date', icon: Calendar },
] as const;

interface CreateCustomBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (block: Omit<TemplateBlock, 'id' | 'createdAt'>) => void;
}

export function CreateCustomBlockModal({ isOpen, onClose, onSave }: CreateCustomBlockModalProps) {
    const [blockName, setBlockName] = useState('');
    const [blockDescription, setBlockDescription] = useState('');
    const [blockCategory, setBlockCategory] = useState('Personal');
    const [fields, setFields] = useState<FormField[]>([]);
    const [editingField, setEditingField] = useState<string | null>(null);

    const addField = (type: FormField['type']) => {
        const newField: FormField = {
            id: Date.now().toString(),
            type,
            label: `New ${type} field`,
            placeholder: '',
            required: false,
            options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
        };
        setFields([...fields, newField]);
        setEditingField(newField.id);
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, ...updates } : field
        ));
    };

    const deleteField = (id: string) => {
        setFields(fields.filter(field => field.id !== id));
        if (editingField === id) {
            setEditingField(null);
        }
    };

    const handleSave = () => {
        if (!blockName.trim()) {
            alert('Please enter a block name');
            return;
        }
        if (fields.length === 0) {
            alert('Please add at least one field');
            return;
        }

        onSave({
            name: blockName,
            description: blockDescription || undefined,
            category: blockCategory,
            fields,
            isCustom: true,
        });

        // Reset form
        setBlockName('');
        setBlockDescription('');
        setBlockCategory('Personal');
        setFields([]);
        setEditingField(null);
        onClose();
    };

    const handleCancel = () => {
        setBlockName('');
        setBlockDescription('');
        setBlockCategory('Personal');
        setFields([]);
        setEditingField(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Create Custom Block</h2>
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-6">
                        {/* Block Settings */}
                        <Card className="p-4 space-y-4">
                            <h3 className="font-medium text-gray-900">Block Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-2">Block Name *</label>
                                    <Input
                                        value={blockName}
                                        onChange={(e) => setBlockName(e.target.value)}
                                        placeholder="Enter block name"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">Category</label>
                                    <select
                                        value={blockCategory}
                                        onChange={(e) => setBlockCategory(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        {blockCategories.filter(cat => cat !== 'All').map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Description (optional)</label>
                                <Input
                                    value={blockDescription}
                                    onChange={(e) => setBlockDescription(e.target.value)}
                                    placeholder="Enter block description"
                                />
                            </div>
                        </Card>

                        {/* Field Types */}
                        <Card className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Add Fields</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {fieldTypes.map((fieldType) => (
                                    <Button
                                        key={fieldType.value}
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => addField(fieldType.value)}
                                    >
                                        <fieldType.icon className="h-4 w-4 mr-2" />
                                        {fieldType.label}
                                    </Button>
                                ))}
                            </div>
                        </Card>

                        {/* Fields List */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Block Fields</h3>

                            {fields.length === 0 ? (
                                <Card className="p-8 text-center border-dashed">
                                    <Plus className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <p className="text-gray-500">No fields added yet. Add fields using the buttons above.</p>
                                </Card>
                            ) : (
                                fields.map((field) => {
                                    const IconComponent = fieldTypes.find(t => t.value === field.type)?.icon || Type;

                                    return (
                                        <Card key={field.id} className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <IconComponent className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">{field.label}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteField(field.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {editingField === field.id && (
                                                <div className="space-y-3 border-t pt-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-sm font-medium">Label</label>
                                                            <Input
                                                                value={field.label}
                                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                placeholder="Field label"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-medium">Placeholder</label>
                                                            <Input
                                                                value={field.placeholder || ''}
                                                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                                                placeholder="Placeholder text"
                                                            />
                                                        </div>
                                                    </div>

                                                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                                        <div>
                                                            <label className="text-sm font-medium">Options (one per line)</label>
                                                            <textarea
                                                                className="w-full p-2 border rounded-md"
                                                                rows={3}
                                                                value={field.options?.join('\n') || ''}
                                                                onChange={(e) => updateField(field.id, {
                                                                    options: e.target.value.split('\n').filter(opt => opt.trim())
                                                                })}
                                                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`required-${field.id}`}
                                                            checked={field.required}
                                                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                        />
                                                        <label htmlFor={`required-${field.id}`} className="text-sm font-medium">
                                                            Required field
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Create Block
                    </Button>
                </div>
            </div>
        </div>
    );
}
