import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon } from "lucide-react";

function Page() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="h-screen relative w-7xl border border-slate-200">
        <div className="absolute bottom-3 left-1 flex flex-row w-full items-center justify-center gap-3 px-10">
          <Textarea placeholder="Type you message here" />
          <Button>
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
