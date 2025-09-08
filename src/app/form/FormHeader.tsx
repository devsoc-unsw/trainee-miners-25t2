import ImgButton from "~/components/ui/ImgButton"
import { Save } from "lucide-react"

export default function FormHeader() {
    return (
        <div className="p-10 flex ">
            <h1 className="font-bold text-3xl">
                Create New Form
            </h1>

            <ImgButton img={<Save className="text-white"/>} text="Save Form"/>
        </div>
    )
}