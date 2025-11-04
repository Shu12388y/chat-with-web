"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addWebsite } from "@/handlers/handler";
import { useRouter } from "next/navigation";

export default function ChatWebsiteLanding() {
  const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const websiteURLMutation = useMutation({
    mutationFn: addWebsite({ webUri: websiteUrl }),
    onSuccess(data) {
      router.push(`/chat/${data.message.jobID}`);
    },
    onError(error) {
      alert(error.message.toString());
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-linear-to-br from-white-200 to-indigo-600 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Chat with Your Website
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Transform any website into an interactive conversation. Just paste
            the URL and start asking questions.
          </p>

          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1 h-14 text-lg border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
              />
              <Button
                onClick={() => websiteURLMutation.mutate()}
                className="h-14 px-8 text-lg bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
              >
                {websiteURLMutation.isPending ? "Loading.." : "Chat"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
