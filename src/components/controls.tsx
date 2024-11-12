"use client";

import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { useSelectedFiles } from "@/store/selected-files.store";

export const Controls = () => {
  const { selectedFiles, clearSelection } = useSelectedFiles();

  return (
    <div
      className={`fixed bottom-0 left-0 mx-auto right-0 bg-background max-w-2xl border md:rounded-t-lg border-border transition-transform duration-300 ease-in-out ${selectedFiles.size > 0 ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
            {selectedFiles.size} selected
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
