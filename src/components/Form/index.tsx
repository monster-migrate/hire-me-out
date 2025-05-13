import styles from "./form.module.css";

import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import TextareaInput from "../Inputs/TextareaInput";
import nunito from "@/lib/fonts/nunito";
import Button from "../Button";
import FileInput from "../Inputs/FileInput";
import CheckboxInput from "../Inputs/CheckboxInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef } from "react";
import { z, ZodString } from "zod";

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
    placeholder?: string;
    options?: { label: string; value: string }[];
    required?: boolean;
}

interface FormProps {
    setIsOpen: (isOpen: boolean) => void;
    onClick: (data: any) => void;
    formHeading: string;
    formDescription: string;
    formFields: FormField[];
}

export default function Form({ setIsOpen, onClick, formHeading, formDescription, formFields }: FormProps) {

    const formRef = useRef<HTMLFormElement>(null);
    

    function generateZodSchema(fields: FormField[]) {
        const schemaShape: Record<string, z.ZodTypeAny> = {};

        fields.forEach((field) => {
            let baseSchema: z.ZodTypeAny = z.string();

            switch (field.type) {
                case "text":
                case "email":
                case "password":
                case "number":
                    baseSchema = z.string();
                    if (field.type === "email" && baseSchema instanceof ZodString) {
                        baseSchema = baseSchema.email("Invalid email");
                    }
                    if (field.type === "number") baseSchema = z.coerce.number();
                    break;

                case "textarea":
                    baseSchema = z.string();
                    break;

                case "select":
                case "radio":
                    baseSchema = z.string();
                    break;

                case "checkbox":
                    baseSchema = z.boolean().refine(val => val === true, {
                        message: "You must accept the terms.",
                    });
                    break;

                case "file":
                    baseSchema = z
                        .instanceof(File)
                        .refine(
                            (file) =>
                                [
                                    "application/pdf",
                                    "application/vnd.ms-excel",
                                ].includes(file.type),
                            { message: "Invalid document file type" }
                        );
                    break;

                default:
                    baseSchema = z.string();
            }

            if (field.required) {
                schemaShape[field.name] = baseSchema;
            } else {
                schemaShape[field.name] = baseSchema.optional();
            }
        });

        return z.object(schemaShape);
    }
    const renderField = (field: FormField) => {
        const commonProps = {
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
        };

        switch (field.type) {
            case 'textarea':
                return <TextareaInput {...commonProps} />;
            case 'select':
                return <SelectInput {...register(field.name)} options={field.options || []} />;
            case "checkbox":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        rules={{ required: field.required }}
                        render={({ field: { value, onChange, name } }) => (
                            <CheckboxInput
                                name={name}
                                label={field.label}
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                            />
                        )}
                    />
                );
            case 'radio':
                return field.options?.map((option) => (
                    <label key={option.value} className={styles.optionLabel}>
                        <input
                            type={field.type}
                            name={field.name}
                            value={option.value}
                            required={field.required}
                        />
                        {option.label}
                    </label>
                ));
            case 'file':
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        rules={{ required: field.required }}
                        render={({ field: { onChange, ref, name } }) => (
                            <FileInput
                                name={name}
                                label={field.label}
                                required={field.required}
                                onChange={(e) => onChange(e.target.files?.[0])}
                                ref={ref}
                            />
                        )}
                    />
                );
            default:
                return <TextInput label={field.label} type={field.type} {...register(field.name)} />;
        }
    };

    const schema = generateZodSchema(formFields);
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm({
        resolver: zodResolver(schema),
    });
    const checkboxValue = watch("checkbox");
    return (
        <div className={`${nunito.className} ${styles.container}`}>
            <h2 className={styles.heading}>
                {formHeading}
                <Image
                    src="/assets/cross1.png"
                    width={9.75} height={9.75} alt="close"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'absolute',
                        top: '7.13px',
                        right: '7.13px',
                        padding: "8px",
                        cursor: "pointer"
                    }} />
            </h2>
            <p className={styles.description}>{formDescription}</p>
            <form className={styles.form} ref={formRef} onSubmit={handleSubmit((data) => {
                console.log("Form submitted:", data);
            })}>
                {Object.values(formFields).map((field) => (
                    <div key={field.name}
                        className={`
                    ${styles.fieldWrapper}
                    ${['checkbox'].includes(field.type) ? styles.fullWidth : ''}
                    `}>
                        {renderField(field)}
                        {errors[field.name] && (
                            <span className={styles.errorText}>
                                {String(errors[field.name]?.message)}
                            </span>
                        )}
                    </div>
                ))}
            </form>
            <Button text="Save" style={checkboxValue ? "primary" : "ghost"}
                onClick={handleSubmit((data) => {
                    onClick(data);
                })} />
        </div>
    );
}
