import { cn } from "@/lib/utils"
import Heading from "../ui/heading"
import { Button } from "../ui/button"
import { Plus } from "lucide-react";

const formatName = (name:string)=>{
  const formattedName =
  name.charAt(0).toUpperCase() + name.slice(1);

const possessive = formattedName.endsWith("s")
  ? `${formattedName}'`
  : `${formattedName}'s`;
  return possessive
}
const Title = ({name}:{name:string})=>{
    const formatedName = formatName(name);
    return (
        <section className={cn(`px-4 pt-10 lg:px-27 flex justify-between items-center`)}>
            {/* <div>
                <p className={cn(`text-[#E35336] font-semibold`)}>
                    WORKSPACE
                </p>
            </div> */}

            <h1>
                <Heading classname={cn(`font-coming-soon text-4xl font-bold mt-3`)} >{formatedName} Canvases</Heading>
            </h1>

            <div>
                <Button><Plus/>Create Canvas</Button>
            </div>
        </section>
    )
}

export default Title