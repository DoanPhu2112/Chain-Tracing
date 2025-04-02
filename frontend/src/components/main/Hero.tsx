import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import { Input } from '@/components/ui/input'

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl-bold md:text-8xl-bold">
          <h1 className="inline">
          Chain {" "}
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
               Tracing
            </span>
          </h1>
        </main>

        <p className="text-3xl-medium text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          For a better blockchain environment
        </p>

        <Input className="w-full min-h-16 rounded-full px-6 placeholder:text-xl-regular" placeholder="Address / Contract / Report / URL " />

      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};