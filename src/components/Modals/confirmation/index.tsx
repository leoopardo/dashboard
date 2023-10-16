import { Modal, Typography } from "antd";
import { Dispatch, SetStateAction } from "react";

export interface ConfirmationModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  submit: () => void;
  title: string;
  description?: string;
  loading?: boolean;
}

export const Confirmation = ({
  open,
  setOpen,
  submit,
  title,
  description,
  loading,
}: ConfirmationModalInterface) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={() => {
        submit();
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
      confirmLoading={loading}
    >
      <Typography>{description}</Typography>
    </Modal>
  );
};
