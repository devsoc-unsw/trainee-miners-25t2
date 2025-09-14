"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { blockCategories, type TemplateBlock } from "~/lib/template-blocks";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import {
    User,
    DollarSign,
    Heart,
    GraduationCap,
    Users,
    Plus,
    Trash2,
} from "lucide-react";

const categoryIcons = {
    Identity: User,
    Financial: DollarSign,
    Health: Heart,
    Academic: GraduationCap,
    Personal: Users,
};

interface TemplateBlockSelectorProps {
    onSelectBlock: (block: TemplateBlock) => void;
    onCreateCustomBlock: () => void;
    selectedBlocks: TemplateBlock[];
    onRemoveBlock: (blockId: string) => void;
}

export function TemplateBlockSelector({
    onSelectBlock,
    onCreateCustomBlock,
    selectedBlocks,
    onRemoveBlock
}: TemplateBlockSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { data: session } = useSession();

    const { data: templateBlocks = [], isLoading } = api.templateBlock.getAll.useQuery({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        includeCustom: true,
        userId: session?.user?.id,
    });

    const filteredBlocks = templateBlocks;

    const isBlockSelected = (blockId: string) =>
        selectedBlocks.some(block => block.id === blockId);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Blocks</h3>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {blockCategories.map((category) => (
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

                {/* Template Blocks Grid */}
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading template blocks...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {filteredBlocks.map((block: {
                            id: string;
                            name: string;
                            description?: string | null;
                            category: string;
                            fields: unknown;
                            isCustom?: boolean;
                            createdAt?: Date;
                        }) => {
                            const IconComponent = categoryIcons[block.category as keyof typeof categoryIcons] ?? User;
                            const isSelected = isBlockSelected(block.id);

                            return (
                                <Card
                                    key={block.id}
                                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-blue-300'
                                        }`}
                                    onClick={() => onSelectBlock({
                                        id: block.id,
                                        name: block.name,
                                        description: block.description ?? undefined,
                                        category: block.category,
                                        fields: Array.isArray(block.fields) ? block.fields : [],
                                        isCustom: block.isCustom,
                                        createdAt: block.createdAt,
                                    } as TemplateBlock)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <IconComponent className="h-5 w-5 text-blue-600" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 text-sm">{block.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{Array.isArray(block.fields) ? block.fields.length : 0} fields</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {block.category}
                                        </Badge>
                                    </div>

                                    {/* Field preview */}
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {Array.isArray(block.fields) && block.fields.slice(0, 3).map((field: any, idx: number) => (
                                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {field.label}
                                            </span>
                                        ))}
                                        {Array.isArray(block.fields) && block.fields.length > 3 && (
                                            <span className="text-xs text-gray-400">
                                                +{block.fields.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Create Custom Block Button */}
                <Button
                    variant="outline"
                    className="w-full border-dashed border-2 h-20 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={onCreateCustomBlock}
                >
                    <Plus className="h-6 w-6 mr-2" />
                    Create Custom Block
                </Button>
            </div>

            {/* Selected Blocks */}
            {selectedBlocks.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Form Structure</h4>
                    <div className="space-y-2">
                        {selectedBlocks.map((block, index) => {
                            const IconComponent = categoryIcons[block.category as keyof typeof categoryIcons] || User;

                            return (
                                <Card key={`${block.id}-${index}`} className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <IconComponent className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium text-sm">{block.name}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {block.category}
                                            </Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onRemoveBlock(`${block.id}-${index}`)}
                                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Field tags */}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {block.fields.map((field, fieldIdx) => (
                                            <span key={fieldIdx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {field.label}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
