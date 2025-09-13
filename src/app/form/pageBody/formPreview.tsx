
import styles from "../form.module.css"

export type field = {
    fieldName: string;
    fieldType: string;
};

export type FormTemplate = {
    id: number,
    name: string,
    fields: field[];
};


function PreviewCard( {form} : {form: FormTemplate}) {
    return (
        <div className="border-gray-300 border-[1px] bg-gray-50 rounded-xl p-5 mt-5">
            <h2 className="text-lg font-semibold">{form.name}</h2>
            {form.fields.map((field, index) => (
                <div key={index} className="pt-2 pb-2">
                    <h3 className="text-md">{field.fieldName}</h3>
                    <input className={`${styles.inp} w-full`} placeholder={`${field.fieldName}`}/>
                </div>
            ))}
        </div>
    )
}

export default function Preview({ forms }: { forms: FormTemplate[]} ) {
    
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <h1 className="mb-4 text-xl font-semibold">Form Preview</h1>
            <hr className="w-[100%] bg-gray-500 h-[3px] border-0" />

            {forms.map((form) => {
                return (
                    <PreviewCard key={form.id} form={form} />
                )
            })}
        </div>
    )
}

