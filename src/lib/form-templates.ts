import { type TemplateBlock, templateBlocks } from './template-blocks';

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select, radio, checkbox
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

export interface FormTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    blockIds: string[]; // References to template block IDs
    additionalFields?: FormField[]; // Any extra fields not covered by blocks
}

// Helper function to get blocks for a template
export function getTemplateBlocks(template: FormTemplate): TemplateBlock[] {
    return template.blockIds.map(blockId => {
        const block = templateBlocks.find(b => b.id === blockId);
        if (!block) {
            console.warn(`Template block with id "${blockId}" not found`);
            return null;
        }
        return block;
    }).filter(Boolean) as TemplateBlock[];
}

// Helper function to get all fields for a template (blocks + additional)
export function getTemplateFields(template: FormTemplate): FormField[] {
    const blocks = getTemplateBlocks(template);
    const blockFields = blocks.flatMap(block => block.fields);
    return [...blockFields, ...(template.additionalFields || [])];
}

export const formTemplates: FormTemplate[] = [
    {
        id: 'contact-form',
        name: 'Contact Form',
        description: 'Basic contact form for customer inquiries',
        category: 'Business',
        blockIds: ['id-short'],
        additionalFields: [
            {
                id: 'subject',
                type: 'text',
                label: 'Subject',
                placeholder: 'What is this regarding?',
                required: true,
            },
            {
                id: 'message',
                type: 'textarea',
                label: 'Message',
                placeholder: 'Please describe your inquiry...',
                required: true,
            },
        ],
    },
    {
        id: 'event-registration',
        name: 'Event Registration',
        description: 'Registration form for events and workshops',
        category: 'Events',
        blockIds: ['id-short'],
        additionalFields: [
            {
                id: 'eventDate',
                type: 'select',
                label: 'Preferred Event Date',
                required: true,
                options: ['March 15, 2025', 'March 22, 2025', 'March 29, 2025'],
            },
            {
                id: 'dietaryRestrictions',
                type: 'checkbox',
                label: 'Dietary Restrictions',
                required: false,
                options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'None'],
            },
        ],
    },
    {
        id: 'job-application',
        name: 'Job Application',
        description: 'Complete job application form with file upload',
        category: 'HR',
        blockIds: ['id-short', 'education'],
        additionalFields: [
            {
                id: 'position',
                type: 'select',
                label: 'Position Applied For',
                required: true,
                options: ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'Marketing Manager'],
            },
            {
                id: 'experience',
                type: 'select',
                label: 'Years of Experience',
                required: true,
                options: ['0-1 years', '2-3 years', '4-5 years', '6-10 years', '10+ years'],
            },
            {
                id: 'availability',
                type: 'radio',
                label: 'Availability',
                required: true,
                options: ['Immediately', 'Within 2 weeks', 'Within 1 month', 'More than 1 month'],
            },
            {
                id: 'coverLetter',
                type: 'textarea',
                label: 'Cover Letter',
                placeholder: 'Tell us why you are interested in this position...',
                required: false,
            },
        ],
    },
    {
        id: 'customer-feedback',
        name: 'Customer Feedback',
        description: 'Collect customer feedback and satisfaction ratings',
        category: 'Feedback',
        blockIds: [],
        additionalFields: [
            {
                id: 'customerName',
                type: 'text',
                label: 'Your Name',
                required: false,
            },
            {
                id: 'email',
                type: 'email',
                label: 'Email (optional)',
                required: false,
            },
            {
                id: 'rating',
                type: 'radio',
                label: 'Overall Satisfaction',
                required: true,
                options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
            },
            {
                id: 'recommend',
                type: 'radio',
                label: 'Would you recommend us to others?',
                required: true,
                options: ['Definitely', 'Probably', 'Not sure', 'Probably not', 'Definitely not'],
            },
            {
                id: 'improvements',
                type: 'checkbox',
                label: 'What could we improve?',
                required: false,
                options: ['Customer Service', 'Product Quality', 'Pricing', 'Website Experience', 'Delivery Speed'],
            },
            {
                id: 'comments',
                type: 'textarea',
                label: 'Additional Comments',
                placeholder: 'Please share any additional feedback...',
                required: false,
            },
        ],
    },
    {
        id: 'survey-basic',
        name: 'Basic Survey',
        description: 'Simple survey template for research and data collection',
        category: 'Research',
        blockIds: [],
        additionalFields: [
            {
                id: 'age',
                type: 'select',
                label: 'Age Group',
                required: true,
                options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
            },
            {
                id: 'gender',
                type: 'radio',
                label: 'Gender',
                required: false,
                options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
            },
            {
                id: 'location',
                type: 'text',
                label: 'Location (City, State)',
                required: false,
            },
            {
                id: 'interests',
                type: 'checkbox',
                label: 'What are your interests?',
                required: false,
                options: ['Technology', 'Sports', 'Arts', 'Travel', 'Food', 'Music', 'Reading', 'Gaming'],
            },
            {
                id: 'feedback',
                type: 'textarea',
                label: 'Additional Thoughts',
                placeholder: 'Share any additional thoughts or suggestions...',
                required: false,
            },
        ],
    },
    {
        id: 'medical-consultation',
        name: 'Medical Consultation',
        description: 'Medical consultation form with patient information',
        category: 'Health',
        blockIds: ['id-long', 'medical'],
        additionalFields: [
            {
                id: 'emergencyContact',
                type: 'text',
                label: 'Emergency Contact',
                placeholder: 'Emergency contact name and phone',
                required: true,
            },
            {
                id: 'reason',
                type: 'textarea',
                label: 'Reason for Visit',
                placeholder: 'Describe the reason for your visit...',
                required: true,
            },
        ],
    },
    {
        id: 'financial-assessment',
        name: 'Financial Assessment',
        description: 'Comprehensive financial assessment form',
        category: 'Financial',
        blockIds: ['id-short', 'financial', 'monthly-living-expenses'],
        additionalFields: [
            {
                id: 'goals',
                type: 'textarea',
                label: 'Financial Goals',
                placeholder: 'Describe your financial goals...',
                required: false,
            },
        ],
    },
];

export const templateCategories = [
    'All',
    'Business',
    'Events',
    'HR',
    'Feedback',
    'Research',
    'Health',
    'Financial',
];
