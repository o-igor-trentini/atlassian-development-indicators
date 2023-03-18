import { FC, ReactNode } from "react";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

export interface ButtonProps {
  children?: ReactNode;
  id: string;
  variant?: AntdButtonProps["type"];
  type?: AntdButtonProps["htmlType"];
  size?: AntdButtonProps["size"];
  disabled?: boolean;
  block?: boolean;
  onClick?: AntdButtonProps["onClick"];
}

export const Button: FC<ButtonProps> = ({
  id,
  children,
  variant = "default",
  type = "button",
  size = "middle",
  disabled = false,
  block = false,
  onClick,
}): JSX.Element => {
  return (
    <AntdButton
      id={"btn-" + id}
      type={variant}
      htmlType={type}
      size={size}
      disabled={disabled}
      block={block}
      onClick={onClick}
    >
      {children}
    </AntdButton>
  );
};
