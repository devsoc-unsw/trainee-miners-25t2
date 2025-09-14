import styles from "./form.module.css"

export default function FormSearch() {
    return (
        <div>
            <h2 className="font-medium">Search</h2>
            <input type="search" className={`${styles.inp} w-[20vw]`} placeholder="Enter Form Name"></input>
        </div>
    )
}