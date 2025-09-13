import { Button } from "./button"
;;
export default function IconButton(props: any) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[10px] flex items-center pl-3 mb-3 "> 
                     {props.img}
                    <Button className="pl-2 text-white">{props.text}</Button>
        </div>
    )
}

