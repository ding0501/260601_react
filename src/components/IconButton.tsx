import Button, { type ButtonProps } from "./Button";

export interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  ioconPosition?: "left" | "right";
}
const IconButton = ({
  icon,
  ioconPosition = "left",
  title,
  ...rest
}: IconButtonProps) => {
  return (
    <Button
      title={
        <span className="flex items-center gap-2">
          {ioconPosition === "left" && icon}
          <span>{title}</span>
          {ioconPosition === "right" && icon}
        </span>
      }
      {...rest}
    />
  );
};
export default IconButton;
