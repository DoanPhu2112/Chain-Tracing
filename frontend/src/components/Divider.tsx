import type * as React from "react";

import { cn } from "@/lib/utils";


export function Divider(): React.ReactElement {
  return <div className={cn("h-px bg-bd-pri-sub")} />;
}
