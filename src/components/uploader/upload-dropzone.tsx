import { Upload } from "lucide-react";

export const UploadDropzone = ({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <Upload className="mb-2 h-6 w-6 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <ul className="text-center text-xs text-gray-500 dark:text-gray-400">
            <li>
              <strong>HEIC</strong> images only
            </li>
            <li>
              Up to <strong>20 files</strong> can be uploaded at once
            </li>
            <li>
              Each file must be less than <strong>20MB</strong>
            </li>
          </ul>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={onChange}
          accept="image/heic"
          multiple
        />
      </label>
    </div>
  );
};
