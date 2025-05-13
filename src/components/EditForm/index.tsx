// components/EditForm.tsx

import styles from "../Form/form.module.css";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import Button from "../Button";
import { useForm } from "react-hook-form";
import nunito from "@/lib/fonts/nunito";
import Image from "next/image";

export type EditFormValues = {
    fullname: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    DateOfJoining: string;
};

interface EditFormProps {
    setIsOpen: (open: boolean) => void;
    onSubmit: (data: EditFormValues) => void;
    initialValues?: Partial<EditFormValues>;
}

export default function EditForm({
    setIsOpen,
    onSubmit,
    initialValues = {},
}: EditFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<EditFormValues>({
        defaultValues: initialValues,
    });

    return (
        <div className={`${nunito.className} ${styles.container}`}>
            <h2 className={styles.heading}>
                Edit Employee
                <Image
                    src="/assets/cross1.png"
                    width={10}
                    height={10}
                    alt="close"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'absolute',
                        top: '7px',
                        right: '7px',
                        padding: "8px",
                        cursor: "pointer"
                    }} />
            </h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.fieldWrapper}>
                    <TextInput label="" val={initialValues.fullname} {...register("fullname", { required: true })} />
                    {errors.fullname && <span className={styles.errorText}>Required</span>}
                </div>
                <div className={styles.fieldWrapper}>
                    <TextInput label="" val={initialValues.email} type="email" {...register("email", { required: true })} />
                    {errors.email && <span className={styles.errorText}>Required</span>}
                </div>
                <div className={styles.fieldWrapper}>
                    <TextInput label="" val={initialValues.phone} {...register("phone", { required: true })} />
                    {errors.phone && <span className={styles.errorText}>Required</span>}
                </div>
                <div className={styles.fieldWrapper}>
                    <TextInput label="" val={initialValues.department} {...register("department", { required: true })} />
                    {errors.department && <span className={styles.errorText}>Required</span>}
                </div>
                <div className={styles.fieldWrapper}>
                    <SelectInput
                        aria-label="Position"
                        val={initialValues.position}
                        {...register("position", { required: true })}
                        options={[
                            { label: "Designer", value: "DESIGNER" },
                            { label: "Developer", value: "DEVELOPER" },
                            { label: "Human Resource", value: "HUMAN_RESOURCE" },
                        ]}
                    />
                    {errors.position && <span className={styles.errorText}>Required</span>}
                </div>
                <div className={styles.fieldWrapper}>
                    <TextInput label="" val={initialValues.DateOfJoining} type="date" {...register("DateOfJoining", { required: true })} />
                    {errors.DateOfJoining && <span className={styles.errorText}>Required</span>}
                </div>
                <Button text="Save" style="primary" onClick={() => { }} />
            </form>
        </div>
    );
}
