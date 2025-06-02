import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { Badge } from "../ui/badge";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}

      {/* Pricing */}
      <Card className="absolute left-[50px] w-96  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between text-2xl-bold">
            Phishing Scam
          </CardTitle>

          <CardDescription>
          Submitted by Phu
          </CardDescription>
        </CardHeader>
        <CardContent className="text-left pb-2 line-clamp-4">
          <p>
          I got scammed of 2.5 ETH after interacting with a fake
            airdrop website. The malicious address prompted wallet connection and 
            executed an automatic token drain via a phishing smart contract.
          </p>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {[
              "Reported Address: 0xabc123...456def",
              "Loss Amount: ~2.5 ETH",
              "Category: Phishing / Scam",
            ].map((item) => (
              <span key={item} className="flex">
                <h3 className="ml-2">{item}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};