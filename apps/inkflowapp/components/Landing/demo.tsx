import { cn } from "@/lib/utils"
const Demo = ()=>{
    return (
        <section className={cn(`w-screen bg-[#f2ede2] `)}>
            <div className={cn(`px-4 pt-20 xl:pl-27`)}>
                <div className={cn(`text-[#E35336] font-semibold`)}>
                    WATCH DEMO
                </div>
                <div className={cn(`font-coming-soon text-4xl font-bold mt-3`)}>
                    From Sketch to Collaboration
                </div>
            </div>

            <div className={cn(`w-full h-full p-4 sm:p-20 sm:px-26`)}>
                <video autoPlay muted loop playsInline preload="metadata" className="rounded-xl">
                    <source src="demo.mp4" type="video/mp4"/>
                </video>
            </div>
        </section>
    )
}

export default Demo