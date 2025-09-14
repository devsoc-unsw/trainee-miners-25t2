"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Search,
    Plus,
    Eye,
    Play,
    FileText,
    Calendar,
    User
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function FormsPage() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: formsData, isLoading } = api.form.getMyForms.useQuery({
        limit: 20,
    });

    const forms = formsData?.forms ?? [];
    const filteredForms = forms.filter((form: { title: string; description?: string | null }) =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (form.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4">Please sign in to view your forms</h2>
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar - reuse from form page */}
            <div className="w-[20vw] h-screen min-w-[220px] p-6 fixed left-0 top-0 overflow-y-auto bg-white border-r">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Formify</span>
                </div>

                {/* Navigation */}
                <div className="space-y-2 mb-8">
                    <Link href="/form">
                        <Button className="w-full justify-start text-gray-600 pl-3" variant="ghost">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Form
                        </Button>
                    </Link>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[10px] flex items-center pl-3">
                        <FileText className="w-6 h-6 text-white" />
                        <Button className="pl-2 text-white" variant="ghost">
                            My Forms
                        </Button>
                    </div>
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
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-[20vw] min-h-screen bg-gray-50">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
                            <p className="text-gray-600 mt-1">Manage and record your forms</p>
                        </div>
                        <Link href="/form">
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create New Form
                            </Button>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Forms Grid */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading forms...</p>
                        </div>
                    ) : filteredForms.length === 0 ? (
                        <Card className="p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? 'No forms found' : 'No forms yet'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery
                                    ? 'Try adjusting your search query'
                                    : 'Create your first form to get started with voice recording'
                                }
                            </p>
                            {!searchQuery && (
                                <Link href="/form">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Form
                                    </Button>
                                </Link>
                            )}
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredForms.map((form: any) => (
                                <Card key={form.id} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                {form.title}
                                            </h3>
                                            {form.description && (
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {form.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        Created {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <FileText className="w-3 h-3 mr-1" />
                                        {Array.isArray(form.fields) ? form.fields.length : 0} fields
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/forms/${form.id}/record`} className="flex-1">
                                            <Button className="w-full flex items-center gap-2" size="sm">
                                                <Play className="w-4 h-4" />
                                                Record
                                            </Button>
                                        </Link>
                                        <Link href={`/forms/${form.id}/preview`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
