"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import {
    ArrowLeft,
    Play,
    FileText,
    Calendar,
    User
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function FormPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const formId = params.id as string;

    const { data: form, isLoading } = api.form.getById.useQuery(
        { id: formId },
        { enabled: !!formId }
    );

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4">Please sign in to access forms</h2>
                    <Button onClick={() => router.push('/login')}>Sign In</Button>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4">Form not found</h2>
                    <Button onClick={() => router.push('/forms')}>Back to Forms</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/forms')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
                            {form.description && (
                                <p className="text-gray-600 mt-1">{form.description}</p>
                            )}
                        </div>
                    </div>

                    <Link href={`/forms/${form.id}/record`}>
                        <Button className="flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Start Recording
                        </Button>
                    </Link>
                </div>

                {/* Form Info */}
                <Card className="p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Created</p>
                                <p className="text-sm text-gray-600">
                                    {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Fields</p>
                                <p className="text-sm text-gray-600">
                                    {Array.isArray(form.fields) ? form.fields.length : 0} fields
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Status</p>
                                <p className="text-sm text-gray-600">
                                    {form.isPublic ? 'Public' : 'Private'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Form Preview */}
                <Card className="p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        Form Preview
                    </h2>

                    <div className="space-y-6">
                        {Array.isArray(form.fields) && (form.fields as Array<{ label: string; required?: boolean; type?: string; placeholder?: string; options?: string[] }>).map((field, index: number) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                                        placeholder={field.placeholder ?? ''}
                                        rows={4}
                                        disabled
                                    />
                                ) : field.type === 'select' ? (
                                    <select className="w-full p-3 border border-gray-300 rounded-md bg-gray-50" disabled>
                                        <option>{field.placeholder ?? 'Select an option'}</option>
                                        {field.options?.map((option: string, idx: number) => (
                                            <option key={idx} value={option}>{option}</option>
                                        ))}
                                    </select>
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

                        <div className="pt-6 text-center">
                            <Button disabled className="px-8">
                                Submit Form
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
