import { Drawer } from "antd";
import React, { Dispatch, SetStateAction } from "react";

interface EditSelfModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditSelfModal = ({ open, setOpen }: EditSelfModalInterface) => {
  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      EditSelfModal
    </Drawer>
  );
};
