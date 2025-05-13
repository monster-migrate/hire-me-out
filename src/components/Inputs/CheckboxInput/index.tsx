import styles from "../inputs.module.css"
interface CheckboxInputProps {
  name: string;
  label: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxInput({ name, label, required, checked, onChange }: CheckboxInputProps) {
  return (
    <div className={styles.checkboxWrapper}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name={name}
          required={required}
          checked={checked ?? false}
          onChange={onChange}
          className={styles.checkbox}
        />
        <span className={styles.disclaimer}>{label}</span>
      </label>
    </div>
  );
}
