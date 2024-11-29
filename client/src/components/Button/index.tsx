import "./button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
    icon?: React.ReactNode;
}

export default function Button({
    children,
    onClick,
    className,
    type = "button",
    disabled = false,
    variant,
    icon,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick && onClick}
            className={`custom-btn ${className ? className : ""} ${variant ? variant : ""}`}
            disabled={disabled}
        >
            {icon && icon}
            {children && children}
        </button>
    );
}
