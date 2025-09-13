'use client';

import React from 'react'
import styles from "../form.module.css"
import type { field, FormTemplate } from "./formPreview"
import { Trash } from 'lucide-react';
import { selectedTemplates } from '../formTemplates';

function StructureCard({form} : {form: FormTemplate}) {
    let [displayCard, setDisplayCard] = React.useState(true)

    function deleteFormStruct() {
        setDisplayCard(false)
    }

    if (!displayCard) {
        return;
    }

    return (
        <div className="flex justify-between items-center">
            <div className="border-gray-300 w-full border-[1px] rounded-xl p-5 mt-5 shadow-sm">
                <h2 className="text-lg font-semibold text-blue-600 mb-3">{form.name}</h2>

                <div className="flex gap-3">
                    {form.fields.map((field, index) => (
                        <div key={index} className="pt-2 pb-2 bg-gray-100 rounded-xl p-3 shadow-xs border-[1px] border-gray-200">
                            <h3 className={`${styles.tag} text-md text-gray-600`}>{field.fieldName}</h3>
                        </div>                    
                    ))}
                </div>
            </div>
            
            <div className="p-5 hover:translate-y-[-7px] transition-transform rounded-lg padding cursor-pointer" onClick={deleteFormStruct}>
                <Trash color="red"/>
            </div>
        </div> 

    )
}

export default function Structure({ forms }: { forms: FormTemplate[]}, refresh: boolean ) {
    let currLen = selectedTemplates.length;
    let [hasAddedTemplate, setStructure] = React.useState(false)

    return (
        <div>
            <div className="bg-white rounded-xl p-5 shadow-sm h-min">
                <h1 className="mb-3 text-lg font-semibold">Form Structure</h1>
                <hr className="w-[100%] bg-gray-700 h-[2px] border-0" />

                {forms.map((form) => <StructureCard key={form.id} form={form}/>)}
            </div>
        </div>
    )
}