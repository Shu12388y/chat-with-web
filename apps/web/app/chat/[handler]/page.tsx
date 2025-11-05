"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon, User, BotIcon } from "lucide-react";
import { chat } from "handlers/handler";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

function Page() {
  const params = useParams();
  const [messages, setMessages] = useState([
    {
      user: "bot",
      message: "Hi, ask me question related to website",
    },
  ]);
  const [userchat, setUserChat] = useState({
    user: "user",
    message: "",
  });

  const chatMutation = useMutation({
    mutationFn: chat({
      jobid: params.handler?.toString() || "",
      message: userchat.message,
    }),
    onMutate() {
      setMessages((prev) => [
        ...prev,
        {
          user: "bot",
          message: "Typing..",
        },
      ]);
    },
    onSuccess(data) {
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length === 0) {
          return [
            {
              user: "bot",
              message: data.toString(),
            },
          ];
        }
        copy[copy.length - 1] = {
          user: "bot",
          message: data.toString(),
        };
        return copy;
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleMessage = () => {
    setMessages([...messages, userchat]);
    setUserChat({
      ...userchat,
      message: "",
    });
    chatMutation.mutate();
  };

  return (
    <main className="flex flex-col items-center justify-center overflow-hidden">
      <div className="h-screen relative lg:w-7xl border border-slate-200 overflow-hidden md:w-3xl w-lg">
        <div className="bg-slate-50 h-full flex flex-col px-10 py-5 gap-3 items-center overflow-y-auto">
          {messages.map((ele, index) => {
            return (
              <>
                <div
                  key={index + "-" + index}
                  className={`flex flex-row items-center ${ele?.user === "user" ? "justify-end" : "justify-start"} p-4 gap-2 w-full`}
                >
                  <div className="bg-slate-200 flex flex-row items-center gap-2 p-2 rounded-xl ">
                    {ele?.user === "user" ? <User /> : <BotIcon />}
                    <div className={`w-60 ${ele.user == "user" ? "text-right" :"text-left"} `}>
                    {ele?.message}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>

        <div className="absolute bottom-3 left-1 flex flex-row w-full items-center justify-center gap-3 px-10">
          <Textarea
            onChange={(e) =>
              setUserChat({ ...userchat, message: e.target.value })
            }
            value={userchat.message}
            className="bg-white"
            placeholder="Type you message here"
          />
          <Button onClick={handleMessage}>
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
