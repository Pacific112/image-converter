"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2, Share, X } from "lucide-react";
import { useSelectedFiles } from "@/store/selected-files.store";
import { Completed } from "@/components/list/types";
import { useState } from "react";

const shareFiles = async (images: Completed[]) => {
  const blobsPromise = images.map((i) =>
    fetch(i.downloadUrl)
      .then((i) => i.blob())
      .then((blob) => new File([blob], `${i.name}.jpg`, { type: blob.type })),
  );

  const files = await Promise.all(blobsPromise);
  return navigator.share({ files });
};

export const Controls = () => {
  const { selectedFiles, clearSelection } = useSelectedFiles();
  const [isSharing, setIsSharing] = useState(false);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 mx-auto max-w-2xl border border-border bg-background transition-transform duration-300 ease-in-out md:rounded-t-lg ${selectedFiles.length > 0 ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
            {selectedFiles.length} selected
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              disabled={isSharing}
              onClick={async () => {
                try {
                  setIsSharing(true);
                  await shareFiles(selectedFiles);
                } finally {
                  setIsSharing(false);
                }
              }}
            >
              <Share className="h-4 w-4" />
              Share
              {isSharing && <Loader2 className="animate-spin" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              disabled
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
