
export let templates = [
  {
    id: 0,
    name: "Contact Form",
    fields: [
      { fieldName: "Name", fieldType: "text" },
      { fieldName: "Email", fieldType: "email" }
    ]
  },
  {
    id: 1,
    name: "Feedback Form",
    fields: [
      { fieldName: "Feedback", fieldType: "textarea" }
    ]
  },
  {
    id: 2,
    name: "New Form",
    fields: [
        { fieldName: "test1", fieldType: "textarea"}
    ]
  },
  {
    id: 3,
    name: "Medical Form",
    fields: [
        { fieldName: "Allergies", fieldType: "textarea"},
        { fieldName: "Symptoms", fieldType: "textarea"},
    ]
  }

];

export let selectedTemplates = [
  templates[0], templates[1], templates[2]
];