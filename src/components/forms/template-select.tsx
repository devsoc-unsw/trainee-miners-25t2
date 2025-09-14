"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { formTemplates, templateCategories, type FormTemplate, getTemplateFields } from "~/lib/form-templates";
import { FileText, Users, Briefcase, MessageSquare, BarChart3, Plus, Heart, DollarSign } from "lucide-react";

const categoryIcons = {
    Business: Briefcase,
    Events: Users,
    HR: FileText,
    Feedback: MessageSquare,
    Research: BarChart3,
    Health: Heart,
    Financial: DollarSign,
};

interface TemplateSelectProps {
    onSelectTemplate: (template: FormTemplate) => void;
    onCreateBlank: () => void;
}

export function TemplateSelect({ onSelectTemplate, onCreateBlank }: TemplateSelectProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTemplates = selectedCategory === 'All'
        ? formTemplates
        : formTemplates.filter(template => template.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Form Template</h2>
                <p className="text-gray-600">Select a pre-built template or start from scratch</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
                {templateCategories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Create Blank Form Option */}
            <Card className="p-6 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                onClick={onCreateBlank}>
                <div className="text-center">
                    <Plus className="mx-auto h-12 w-12 text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Start from Blank</h3>
                    <p className="text-blue-700">Create a custom form from scratch</p>
                </div>
            </Card>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                    const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || FileText;

                    return (
                        <Card
                            key={template.id}
                            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border hover:border-blue-300"
                            onClick={() => onSelectTemplate(template)}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <IconComponent className="h-8 w-8 text-blue-600" />
                                    <Badge variant="secondary">{template.category}</Badge>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{getTemplateFields(template).length} fields</span>
                                    <Button size="sm" variant="ghost" className="h-auto p-0 text-blue-600 hover:text-blue-700">
                                        Use Template →
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">No templates found in this category</p>
                </div>
            )}
        </div>
    );
}
