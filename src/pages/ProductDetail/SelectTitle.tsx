interface SelectedTitleProps {
  text1: string;
  text2: string;
}
const SelectTitle = ({ text1, text2 }: SelectedTitleProps) => {
  return (
    <div className="flex">
      <h2 className="text-lg   font-semibold">{text1}</h2>
      <h2 className="text-lg text-gray-600 font-semibold ml-2">{text2}</h2>
    </div>
  );
};
export default SelectTitle;
