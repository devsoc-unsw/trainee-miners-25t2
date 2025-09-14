"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import styles from "./form.module.css";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/trpc/react";
import {
    SquarePen, Mic, User, LogOut, Settings, FolderOpen
} from "lucide-react";

import { TemplateSelect } from "~/components/forms/template-select";
import { BlockFormBuilder } from "~/components/forms/block-form-builder";
import { type FormTemplate } from "~/lib/form-templates";
import { type TemplateBlock } from "~/lib/template-blocks";

type PageState = 'select' | 'build';

export default function FormPage() {
    const { data: session } = useSession();
    const [currentState, setCurrentState] = useState<PageState>('select');
    const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | undefined>();

    const createFormMutation = api.form.create.useMutation({
        onSuccess: (data) => {
            alert(`Form "${data.title}" saved successfully!`);
            setCurrentState('select');
            setSelectedTemplate(undefined);
        },
        onError: (error) => {
            alert(`Error saving form: ${error.message}`);
        },
    });

    const handleSelectTemplate = (template: FormTemplate) => {
        setSelectedTemplate(template);
        setCurrentState('build');
    };

    const handleCreateBlank = () => {
        setSelectedTemplate(undefined);
        setCurrentState('build');
    };

    const handleSaveForm = (formData: { title: string; description: string; blocks: TemplateBlock[] }) => {
        // Convert blocks to fields format but preserve block information
        const fields = formData.blocks.flatMap(block =>
            block.fields.map(field => ({
                id: `${block.id}-${field.id}`,
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                required: field.required,
                options: field.options,
                validation: field.validation,
                // Preserve template block information
                templateBlockId: block.id,
                templateBlockName: block.name,
                templateBlockCategory: block.category,
            }))
        );

        createFormMutation.mutate({
            title: formData.title,
            description: formData.description || "",
            fields: fields,
            isPublic: false, // Default to private
        });
    };

    const handleCancel = () => {
        setCurrentState('select');
        setSelectedTemplate(undefined);
    };

    return (
        <div className="flex min-h-screen">
            {/* Side Column */}
            <div className={`${styles.container} w-[20vw] h-screen min-w-[220px] p-6 fixed left-0 top-0 overflow-y-auto`}>
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Mic className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Formify</span>
                </div>

                {/* Navigation */}
                <div className="space-y-2 mb-8">
                    <div className={`${currentState === 'build' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-100'} rounded-[10px] flex items-center pl-3`}>
                        <SquarePen className={`w-6 h-6 ${currentState === 'build' ? 'text-white' : 'text-gray-600'}`} />
                        <Button
                            className={`pl-2 ${currentState === 'build' ? 'text-white' : 'text-gray-600'}`}
                            variant="ghost"
                            onClick={() => setCurrentState('select')}
                        >
                            Create Form
                        </Button>
                    </div>

                    <Link href="/forms">
                        <Button className="w-full justify-start text-gray-600 pl-3" variant="ghost">
                            <FolderOpen className="w-5 h-5 mr-2" />
                            My Forms
                        </Button>
                    </Link>
                </div>

                {/* User Section */}
                {session?.user && (
                    <div className="mt-auto border-t pt-4">
                        <div className="flex items-center gap-3 mb-3">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {session.user.name || session.user.email}
                                </p>
                                {session.user.name && (
                                    <p className="text-xs text-gray-500 truncate">
                                        {session.user.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-gray-600"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-[20vw] min-h-screen bg-gray-50">
                <div className="p-8">
                    {currentState === 'select' ? (
                        <TemplateSelect
                            onSelectTemplate={handleSelectTemplate}
                            onCreateBlank={handleCreateBlank}
                        />
                    ) : (
                        <BlockFormBuilder
                            onSave={handleSaveForm}
                            onCancel={handleCancel}
                            isSaving={createFormMutation.isPending}
                            initialTemplate={selectedTemplate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
