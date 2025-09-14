import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const FormFieldSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date']),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        message: z.string().optional(),
    }).optional(),
    // Template block information
    templateBlockId: z.string().optional(),
    templateBlockName: z.string().optional(),
    templateBlockCategory: z.string().optional(),
});

const CreateFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    fields: z.array(FormFieldSchema),
    isPublic: z.boolean().default(false),
});

const UpdateFormSchema = CreateFormSchema.partial().extend({
    id: z.string(),
});

export const formRouter = createTRPCRouter({
    // Create a new form
    create: protectedProcedure
        .input(CreateFormSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.form.create({
                data: {
                    title: input.title,
                    description: input.description,
                    fields: input.fields,
                    isPublic: input.isPublic,
                    createdById: ctx.session.user.id,
                },
            });
        }),

    // Get all forms for the current user
    getMyForms: protectedProcedure
        .input(
            z.object({
                cursor: z.string().optional(),
                limit: z.number().min(1).max(100).default(10),
            })
        )
        .query(async ({ ctx, input }) => {
            const forms = await ctx.db.form.findMany({
                where: {
                    createdById: ctx.session.user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isPublic: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            responses: true,
                        },
                    },
                },
            });

            let nextCursor: typeof input.cursor | undefined = undefined;
            if (forms.length > input.limit) {
                const nextItem = forms.pop();
                nextCursor = nextItem!.id;
            }

            return {
                forms,
                nextCursor,
            };
        }),

    // Get a single form by ID
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const form = await ctx.db.form.findFirst({
                where: {
                    id: input.id,
                    OR: [
                        { createdById: ctx.session.user.id },
                        { isPublic: true },
                    ],
                },
            });

            if (!form) {
                throw new Error("Form not found or access denied");
            }

            return form;
        }),

    // Update a form
    update: protectedProcedure
        .input(UpdateFormSchema)
        .mutation(async ({ ctx, input }) => {
            const form = await ctx.db.form.findUnique({
                where: { id: input.id },
                select: { createdById: true },
            });

            if (!form) {
                throw new Error("Form not found");
            }

            if (form.createdById !== ctx.session.user.id) {
                throw new Error("Access denied");
            }

            const { id, ...updateData } = input;
            return ctx.db.form.update({
                where: { id },
                data: updateData,
            });
        }),

    // Delete a form
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const form = await ctx.db.form.findUnique({
                where: { id: input.id },
                select: { createdById: true },
            });

            if (!form) {
                throw new Error("Form not found");
            }

            if (form.createdById !== ctx.session.user.id) {
                throw new Error("Access denied");
            }

            return ctx.db.form.delete({
                where: { id: input.id },
            });
        }),

    // Submit a response to a form
    submitResponse: publicProcedure
        .input(
            z.object({
                formId: z.string(),
                data: z.record(z.any()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const form = await ctx.db.form.findUnique({
                where: { id: input.formId },
                select: { isPublic: true, isActive: true },
            });

            if (!form || !form.isActive) {
                throw new Error("Form not found or inactive");
            }

            if (!form.isPublic && !ctx.session?.user?.id) {
                throw new Error("Authentication required");
            }

            return ctx.db.formResponse.create({
                data: {
                    formId: input.formId,
                    data: input.data,
                    respondentId: ctx.session?.user?.id,
                },
            });
        }),

    // Get responses for a form (owner only)
    getResponses: protectedProcedure
        .input(
            z.object({
                formId: z.string(),
                cursor: z.string().optional(),
                limit: z.number().min(1).max(100).default(10),
            })
        )
        .query(async ({ ctx, input }) => {
            const form = await ctx.db.form.findUnique({
                where: { id: input.formId },
                select: { createdById: true },
            });

            if (!form) {
                throw new Error("Form not found");
            }

            if (form.createdById !== ctx.session.user.id) {
                throw new Error("Access denied");
            }

            const responses = await ctx.db.formResponse.findMany({
                where: {
                    formId: input.formId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                include: {
                    respondent: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            let nextCursor: typeof input.cursor | undefined = undefined;
            if (responses.length > input.limit) {
                const nextItem = responses.pop();
                nextCursor = nextItem!.id;
            }

            return {
                responses,
                nextCursor,
            };
        }),
});
