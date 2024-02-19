/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ViewModalFields } from "./ViewModalFields";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id: string;
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  return (
    <Drawer
      title={`${t("table.details")}: (${props?.id || "-"})`}
      placement="right"
      onClose={onClose}
      open={props.open}
      bodyStyle={{ padding: 0 }}
    >
      {props.open && (
        <ViewModalFields
          id={props.id}
          open={props.open}
          setOpen={props.setOpen}
        />
      )}
    </Drawer>
  );
};
