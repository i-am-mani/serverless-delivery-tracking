import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";

type Props = {
  className?: string;
  icon: IconProp;
  iconSize?: FontAwesomeIconProps["size"];
  placeholder: string;
  placeholderClassName?: string;
  onClick?: () => void;
};

function UnstyledButton({
  icon,
  iconSize,
  className: styles,
  placeholder,
  placeholderClassName,
  onClick,
}: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center space-x-1",
        "border rounded-md shadow-sm",
        styles,
        "hover:shadow-md",
        "px-2 py-1"
      )}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} size={iconSize} />
      <p className={placeholderClassName}>{placeholder}</p>
    </button>
  );
}

export default UnstyledButton;
