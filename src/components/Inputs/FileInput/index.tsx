// FileInput.tsx
import { forwardRef, useState, useImperativeHandle, useRef } from "react";
import styles from "../inputs.module.css";
import { FaUpload } from "react-icons/fa6";

interface FileInputProps {
  label: string;
  name: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, name, required, onChange }, ref) => {
    const [fileName, setFileName] = useState("");
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setFileName(file.name);
      onChange?.(e);
    };

    return (
      <div className={`${styles.inputWrapper} ${styles.fileWrapper}`}>
        <input
          type="file"
          name={name}
          required={required}
          ref={localRef}
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
        <div className={styles.customFileButton} onClick={() => localRef.current?.click()}>
          <FaUpload size={18} />
          <span>{fileName || "Choose a file"}</span>
        </div>
        <label className={`${styles.label} ${styles.fileLabel}`}>{label}</label>
      </div>
    );
  }
);
FileInput.displayName = "FileInput";
export default FileInput;
