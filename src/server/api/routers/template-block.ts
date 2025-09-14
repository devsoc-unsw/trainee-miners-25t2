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
});

const CreateTemplateBlockSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    category: z.string(),
    fields: z.array(FormFieldSchema),
    isCustom: z.boolean().default(true),
    isPublic: z.boolean().default(false),
});

export const templateBlockRouter = createTRPCRouter({
    // Create a new template block
    create: protectedProcedure
        .input(CreateTemplateBlockSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.templateBlock.create({
                data: {
                    name: input.name,
                    description: input.description,
                    category: input.category,
                    fields: input.fields,
                    isCustom: input.isCustom,
                    isPublic: input.isPublic,
                    createdById: ctx.session.user.id,
                },
            });
        }),

    // Get all template blocks (predefined + user's custom blocks)
    getAll: publicProcedure
        .input(
            z.object({
                category: z.string().optional(),
                includeCustom: z.boolean().default(true),
                userId: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {};

            if (input.category && input.category !== 'All') {
                where.category = input.category;
            }

            if (input.includeCustom && input.userId) {
                where.OR = [
                    { isCustom: false }, // Predefined blocks
                    {
                        isCustom: true,
                        createdById: input.userId
                    }, // User's custom blocks
                    {
                        isCustom: true,
                        isPublic: true
                    }, // Public custom blocks
                ];
            } else {
                where.isCustom = false; // Only predefined blocks
            }

            return ctx.db.templateBlock.findMany({
                where,
                orderBy: [
                    { isCustom: 'asc' }, // Predefined blocks first
                    { name: 'asc' },
                ],
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
        }),

    // Get user's custom template blocks
    getMyBlocks: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.templateBlock.findMany({
                where: {
                    createdById: ctx.session.user.id,
                    isCustom: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }),

    // Update a template block
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
                category: z.string().optional(),
                fields: z.array(FormFieldSchema).optional(),
                isPublic: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const block = await ctx.db.templateBlock.findUnique({
                where: { id: input.id },
                select: { createdById: true, isCustom: true },
            });

            if (!block) {
                throw new Error("Template block not found");
            }

            if (!block.isCustom || block.createdById !== ctx.session.user.id) {
                throw new Error("Access denied");
            }

            const { id, ...updateData } = input;
            return ctx.db.templateBlock.update({
                where: { id },
                data: updateData,
            });
        }),

    // Delete a template block
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const block = await ctx.db.templateBlock.findUnique({
                where: { id: input.id },
                select: { createdById: true, isCustom: true },
            });

            if (!block) {
                throw new Error("Template block not found");
            }

            if (!block.isCustom || block.createdById !== ctx.session.user.id) {
                throw new Error("Access denied");
            }

            return ctx.db.templateBlock.delete({
                where: { id: input.id },
            });
        }),
});
