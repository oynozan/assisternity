import "./input.scss";

type Variants = "gray" | "white";

export default function Input({
    onChange,
    type = "text",
    name,
    defaultValue,
    value,
    placeholder,
    icon,
    rounded,
    style,
    variant = "gray",
}: {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string;
    defaultValue?: string;
    value?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    rounded?: boolean;
    style?: React.CSSProperties;
    variant?: Variants;
}) {
    return (
        <div className="input-wrapper">
            {icon && <div className="icon">{icon}</div>}
            <input
                type={type}
                name={name}
                defaultValue={defaultValue}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                style={style}
                className={`input ${rounded ? "rounded" : " "}${variant ? variant : ""}`}
            />
        </div>
    );
}
