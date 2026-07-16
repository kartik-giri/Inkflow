import { cn } from "@/lib/utils";
import { Logo } from "../ui/logo";
import { Card } from "../ui/cardWrapper";
import { ArrowRight, X } from "lucide-react";
import { XTwitterIcon } from "../icons/XTwitterIcon";
import { GithubIcon } from "../icons/github";
import LinkedinIcon from "../icons/linkedin";
const Footer = () => {
  return (
    <section
      className={cn(`py-20 md:grid grid-cols-3 bg-[#f2ede2] px-4 xl:px-27 `)}
    >
      <div>
        <div >
          <Logo />
        </div>
        <div
          className={cn(
            `font-coming-soon text-2xl font-extrabold text-gray-500 py-5`,
          )}
        >
          <p>Draw ideas</p>
          <p>ship faster.</p>
        </div>

        <div className={cn(`flex gap-2`)}>
          <div className={cn(`cursor-pointer`)}>
            <a href="https://x.com/0xKartikgiri00" target="_blank">
              <Card className="p-2 w-fit rounded-md">
                <XTwitterIcon />
              </Card>
            </a>
          </div>

          <div className={cn(`cursor-pointer`)}>
            <a href="https://github.com/kartik-giri" target="_blank">
              <Card className="p-2 w-fit rounded-md">
                <GithubIcon className="w-5" />
              </Card>
            </a>
          </div>

          <div className={cn(`cursor-pointer`)}>
            <a href="https://www.linkedin.com/in/kartikgiri00/" target="_blank">
              <Card className="p-2 w-fit rounded-md">
                <LinkedinIcon />
              </Card>
            </a>
          </div>
        </div>
      </div>

      {/* <div> */}
      <div>
        <div className={cn(`text-sm mt-6 md:mt-0 text-gray-500`)}>
          <p>PRODUCT</p>
        </div>
        <div className={cn(`py-3`)}>Features</div>
        <div>Demo Video</div>
      </div>

      <div>
        <div className={cn(`text-sm mt-12 md:mt-0 text-gray-500`)}>
          <p>CONTACT</p>
        </div>
        <div className={cn(`py-3`)}>Kartikgiri1t30@gmail.com</div>
        <a href="https://github.com/kartik-giri" target="_blank" className="cursor-pointer"> 
        <div className="flex gap-1">Github <ArrowRight/></div>
        </a>
      </div>
      {/* </div> */}
    </section>
  );
};

export default Footer;
