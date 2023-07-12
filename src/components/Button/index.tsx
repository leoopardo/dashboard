import { Button } from "antd";

interface ButtonInterface {
  title: string;
  loading: boolean;
  type: "primary" | "dashed" | "default" | "ghost" | "link" | "text";
  onClick: () => void;
}

export const ButtonComponent = (props: ButtonInterface) => {
  return (
    <Button
      style={{ width: "100%", height: "40px" }}
      loading={props.loading}
      type={props.type}
      color="red"
      onClickCapture={props.onClick}
    >
      {props.title}
    </Button>
  );
};
