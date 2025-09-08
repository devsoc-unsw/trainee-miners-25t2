import { Button } from "~/components/ui/button";
import styles from "./form.module.css"

import Link from "next/link";
import {
  SquarePen, Mic, Zap, Users, Shield, Clock, MessageSquare,
  ArrowRight, CheckCircle, Menu, X, Bell
} from "lucide-react";


import FormHeader from "./FormHeader"

export default function formPage() {
    return (
        <div className="flex"> 
            {/* Side Column */}
            <div className={`${styles.container} w-[20vw] h-[100vh] min-w-[220px] p-10`}>
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Mic className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Formify</span>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[10px] flex items-center pl-3 mb-3"> 
                     <SquarePen className="w-6 h-6 text-white" />
                    <Button className="pl-2 text-white">Create Form</Button>
                </div>

                
                <Button className="text-gray-600 pl-2">My Forms</Button>
                
            </div>

            {/* Actual form page*/}
            <div className="bg-red-50 w-[80vw]">
                <FormHeader />
            </div>
        </div>
    )
}
