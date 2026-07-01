import Demo from "@/components/Landing/demo"
import Features from "@/components/Landing/features"
import HeroSection from "@/components/Landing/heroSection"

const Landing = ()=>{
    return (
        <section>
            <HeroSection/>
            <Demo/>
            <Features/>
        </section>
    )
}

export default Landing