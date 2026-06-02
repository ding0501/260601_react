const colorMapping = {
  沙漠色钛金属: ["#BFA48F", "#D8C7B8"],
  原色钛金属: ["#BDBE74", "#B0B1B4"],
  白色钛金属: ["#E0E0E0", "#F5F5F5"],
  黑色钛金属: ["#1C1C1E", "#4A4A4C"],
} as const;

interface SelectCircleProps {
  color: keyof typeof colorMapping;
  isSelected?: boolean;
  onClick?: () => void;
}
const SelectCircle = ({
  color,
  isSelected = false,
  onClick,
}: SelectCircleProps) => {
  const [primaryColor, secondaryColor] = colorMapping[color] || ["000", "FFF"];
  return (
    <div
      className={`w-6 h-6 rounded-full relative cursor-pointer
        ${
          isSelected
            ? "ring-2 ring-apple-blue ring-offset-2"
            : "hover:ring-2 hover:ring-apple-blue"
        }`}
      style={{
        background: `linear-gradient(to bottom,${primaryColor},${secondaryColor})`,
      }}
      onClick={onClick}
    ></div>
  );
};
export default SelectCircle;
