export interface TemplateBlock {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    fields: FormField[];
    isCustom?: boolean;
    createdAt?: Date;
}

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

// Predefined template blocks as shown in the design
export const templateBlocks: TemplateBlock[] = [
    {
        id: 'id-short',
        name: 'ID Short',
        description: 'Basic identification information',
        category: 'Identity',
        fields: [
            {
                id: 'name',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name',
                required: true,
            },
            {
                id: 'phone',
                type: 'text',
                label: 'Phone Number',
                placeholder: 'Enter phone number',
                required: true,
            },
            {
                id: 'email',
                type: 'email',
                label: 'Email',
                placeholder: 'Enter email address',
                required: true,
            },
        ],
    },
    {
        id: 'id-long',
        name: 'ID Long',
        description: 'Extended identification information',
        category: 'Identity',
        fields: [
            {
                id: 'name',
                type: 'text',
                label: 'Name',
                placeholder: 'Enter name',
                required: true,
            },
            {
                id: 'phone',
                type: 'text',
                label: 'Phone Number',
                placeholder: 'Enter phone number',
                required: true,
            },
            {
                id: 'email',
                type: 'email',
                label: 'Email',
                placeholder: 'Enter email address',
                required: true,
            },
            {
                id: 'address',
                type: 'textarea',
                label: 'Address',
                placeholder: 'Enter full address',
                required: false,
            },
            {
                id: 'dateOfBirth',
                type: 'date',
                label: 'Date of Birth',
                placeholder: 'Select date of birth',
                required: false,
            },
        ],
    },
    {
        id: 'monthly-living-expenses',
        name: 'Monthly Living Expenses',
        description: 'Track monthly living expenses',
        category: 'Financial',
        fields: [
            {
                id: 'food',
                type: 'number',
                label: 'Food',
                placeholder: 'Enter food expenses',
                required: false,
            },
            {
                id: 'recreation',
                type: 'number',
                label: 'Recreation',
                placeholder: 'Enter recreation expenses',
                required: false,
            },
            {
                id: 'insurances',
                type: 'number',
                label: 'Insurances',
                placeholder: 'Enter insurance costs',
                required: false,
            },
            {
                id: 'utilities',
                type: 'number',
                label: 'Utilities',
                placeholder: 'Enter utility costs',
                required: false,
            },
            {
                id: 'rent',
                type: 'number',
                label: 'Rent',
                placeholder: 'Enter rent amount',
                required: false,
            },
            {
                id: 'debtRepayments',
                type: 'number',
                label: 'Debt Repayments',
                placeholder: 'Enter debt repayment amount',
                required: false,
            },
        ],
    },
    {
        id: 'medical',
        name: 'Medical',
        description: 'Medical information and history',
        category: 'Health',
        fields: [
            {
                id: 'symptoms',
                type: 'textarea',
                label: 'Symptoms',
                placeholder: 'Describe symptoms',
                required: false,
            },
            {
                id: 'duration',
                type: 'text',
                label: 'Duration',
                placeholder: 'How long have symptoms persisted?',
                required: false,
            },
            {
                id: 'possibleCauses',
                type: 'textarea',
                label: 'Possible Causes',
                placeholder: 'Any suspected causes?',
                required: false,
            },
            {
                id: 'allergies',
                type: 'textarea',
                label: 'Allergies',
                placeholder: 'List any known allergies',
                required: false,
            },
            {
                id: 'currentMedications',
                type: 'textarea',
                label: 'Current Medications',
                placeholder: 'List current medications',
                required: false,
            },
            {
                id: 'medicalHistory',
                type: 'textarea',
                label: 'Medical History',
                placeholder: 'Describe relevant medical history',
                required: false,
            },
        ],
    },
    {
        id: 'education',
        name: 'Education',
        description: 'Educational background information',
        category: 'Academic',
        fields: [
            {
                id: 'schoolName',
                type: 'text',
                label: 'School Name',
                placeholder: 'Enter school name',
                required: false,
            },
            {
                id: 'degree',
                type: 'text',
                label: 'Degree',
                placeholder: 'Enter degree type',
                required: false,
            },
            {
                id: 'major',
                type: 'text',
                label: 'Major',
                placeholder: 'Enter major/field of study',
                required: false,
            },
            {
                id: 'graduationYear',
                type: 'number',
                label: 'Graduation Year',
                placeholder: 'Enter graduation year',
                required: false,
            },
        ],
    },
    {
        id: 'social-media',
        name: 'Social Media',
        description: 'Social media profile information',
        category: 'Personal',
        fields: [
            {
                id: 'platform',
                type: 'select',
                label: 'Platform',
                placeholder: 'Select platform',
                required: false,
                options: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Other'],
            },
            {
                id: 'username',
                type: 'text',
                label: 'Username',
                placeholder: 'Enter username/handle',
                required: false,
            },
            {
                id: 'followerCount',
                type: 'number',
                label: 'Follower Count',
                placeholder: 'Enter follower count',
                required: false,
            },
        ],
    },
    {
        id: 'financial',
        name: 'Financial',
        description: 'Financial information and status',
        category: 'Financial',
        fields: [
            {
                id: 'employment',
                type: 'select',
                label: 'Employment',
                placeholder: 'Select employment status',
                required: false,
                options: ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'],
            },
            {
                id: 'netEquity',
                type: 'number',
                label: 'Net Equity',
                placeholder: 'Enter net equity',
                required: false,
            },
            {
                id: 'creditScore',
                type: 'number',
                label: 'Credit Score',
                placeholder: 'Enter credit score',
                required: false,
            },
            {
                id: 'annualIncome',
                type: 'number',
                label: 'Annual Income',
                placeholder: 'Enter annual income',
                required: false,
            },
            {
                id: 'debtServiceCoverageRatio',
                type: 'number',
                label: 'Debt Service Coverage Ratio',
                placeholder: 'Enter debt service coverage ratio',
                required: false,
            },
        ],
    },
    {
        id: 'class-notes',
        name: 'Class Notes',
        description: 'Academic class notes and information',
        category: 'Academic',
        fields: [
            {
                id: 'class',
                type: 'text',
                label: 'Class',
                placeholder: 'Enter class name',
                required: false,
            },
            {
                id: 'topic',
                type: 'text',
                label: 'Topic',
                placeholder: 'Enter topic',
                required: false,
            },
            {
                id: 'notes',
                type: 'textarea',
                label: 'Notes',
                placeholder: 'Enter notes',
                required: false,
            },
        ],
    },
];

export const blockCategories = [
    'All',
    'Identity',
    'Financial',
    'Health',
    'Academic',
    'Personal',
];
