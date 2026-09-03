import React from "react";
import { RiLoader2Fill } from "react-icons/ri";

interface IButtonSpinnerProps {
  color?: string
}
const ButtonSpinner: React.FC = ({ color }: IButtonSpinnerProps) => (
<span>
  <RiLoader2Fill className={` text-[${color || '#fff'}] animate-spin`} />
</span>
);

export default ButtonSpinner;
