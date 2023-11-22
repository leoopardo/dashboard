import { Drawer } from "antd";
import { Dispatch, SetStateAction } from "react";

interface ILoginModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const LoginModal = ({ open, setOpen }: ILoginModal) => {
  return (
    <Drawer
      title="Faça login"
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};
