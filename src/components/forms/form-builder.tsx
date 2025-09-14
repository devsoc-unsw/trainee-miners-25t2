"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { type FormField, type FormTemplate } from "~/lib/form-templates";
import {
    Plus,
    Trash2,
    GripVertical,
    Type,
    Mail,
    Hash,
    Calendar,
    List,
    CheckSquare,
    Circle,
    FileText,
    Eye,
    Edit3
} from "lucide-react";

const fieldTypeIcons = {
    text: Type,
    email: Mail,
    number: Hash,
    date: Calendar,
    textarea: FileText,
    select: List,
    checkbox: CheckSquare,
    radio: Circle,
};

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

interface FormBuilderProps {
    template?: FormTemplate;
    onSave: (formData: { title: string; description: string; fields: FormField[] }) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export function FormBuilder({ template, onSave, onCancel, isSaving = false }: FormBuilderProps) {
    const [formTitle, setFormTitle] = useState(template?.name || 'Untitled Form');
    const [formDescription, setFormDescription] = useState(template?.description || '');
    const [fields, setFields] = useState<FormField[]>(template?.fields || []);
    const [isPreview, setIsPreview] = useState(false);
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

    const moveField = (id: string, direction: 'up' | 'down') => {
        const index = fields.findIndex(field => field.id === id);
        if (
            (direction === 'up' && index > 0) ||
            (direction === 'down' && index < fields.length - 1)
        ) {
            const newFields = [...fields];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            const temp = newFields[index];
            newFields[index] = newFields[targetIndex]!;
            newFields[targetIndex] = temp!;
            setFields(newFields);
        }
    };

    const handleSave = () => {
        if (!formTitle.trim()) {
            alert('Please enter a form title');
            return;
        }
        onSave({
            title: formTitle,
            description: formDescription,
            fields,
        });
    };

    const renderFieldEditor = (field: FormField) => {
        const IconComponent = fieldTypeIcons[field.type];

        return (
            <Card key={field.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <Badge variant="outline" className="text-xs">
                            {fieldTypes.find(t => t.value === field.type)?.label}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveField(field.id, 'up')}
                            disabled={fields.findIndex(f => f.id === field.id) === 0}
                        >
                            ↑
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveField(field.id, 'down')}
                            disabled={fields.findIndex(f => f.id === field.id) === fields.length - 1}
                        >
                            ↓
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                        >
                            <Edit3 className="h-3 w-3" />
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

                {editingField === field.id ? (
                    <div className="space-y-3 border-t pt-3">
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
                ) : (
                    <div>
                        <div className="font-medium">{field.label}</div>
                        {field.placeholder && (
                            <div className="text-sm text-gray-500">{field.placeholder}</div>
                        )}
                        {field.required && (
                            <Badge variant="secondary" className="text-xs mt-1">Required</Badge>
                        )}
                    </div>
                )}
            </Card>
        );
    };

    const renderPreview = () => (
        <Card className="p-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">{formTitle}</h2>
                    {formDescription && (
                        <p className="text-gray-600">{formDescription}</p>
                    )}
                </div>

                <div className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label className="block font-medium">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    placeholder={field.placeholder}
                                    rows={3}
                                    disabled
                                />
                            ) : field.type === 'select' ? (
                                <select className="w-full p-2 border rounded-md" disabled>
                                    <option>{field.placeholder || 'Select an option'}</option>
                                    {field.options?.map((option, idx) => (
                                        <option key={idx} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : field.type === 'radio' ? (
                                <div className="space-y-2">
                                    {field.options?.map((option, idx) => (
                                        <label key={idx} className="flex items-center gap-2">
                                            <input type="radio" name={field.id} disabled />
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
                                />
                            )}
                        </div>
                    ))}
                </div>

                <Button className="w-full" disabled>
                    Submit Form
                </Button>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Form Builder</h1>
                    <p className="text-gray-600">Design your form with drag-and-drop simplicity</p>
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
                renderPreview()
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar - Field Types */}
                    <div className="col-span-3">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3">Add Fields</h3>
                            <div className="space-y-2">
                                {fieldTypes.map((fieldType) => (
                                    <Button
                                        key={fieldType.value}
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => addField(fieldType.value)}
                                    >
                                        <fieldType.icon className="h-4 w-4 mr-2" />
                                        {fieldType.label}
                                    </Button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9">
                        <div className="space-y-4">
                            {/* Form Settings */}
                            <Card className="p-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block font-medium mb-1">Form Title</label>
                                        <Input
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            placeholder="Enter form title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Description (optional)</label>
                                        <Input
                                            value={formDescription}
                                            onChange={(e) => setFormDescription(e.target.value)}
                                            placeholder="Enter form description"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Form Fields */}
                            <div className="space-y-3">
                                {fields.length === 0 ? (
                                    <Card className="p-8 text-center border-dashed">
                                        <Plus className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-gray-500">No fields added yet. Start by adding a field from the sidebar.</p>
                                    </Card>
                                ) : (
                                    fields.map(renderFieldEditor)
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
