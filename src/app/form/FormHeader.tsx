import ImgButton from "~/components/ui/ImgButton"
import { Save } from "lucide-react"

export default function FormHeader() {
    return (
        <div className="flex justify-between mb-15">
            <h1 className="font-bold text-3xl">
                Create New Form
            </h1>

            <ImgButton img={<Save className="text-white"/>} text="Save Form"/>
        </div>
    )
}