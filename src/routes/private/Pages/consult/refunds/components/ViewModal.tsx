/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ViewModalFields } from "./ViewModalFields";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  item: any;
  type: "Refund" | "manual" | "withdraw";
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  return (
    <Drawer
      title={`${t("table.details")}: (${props?.item?._id || "-"})`}
      placement="right"
      onClose={onClose}
      open={props.open}
      bodyStyle={{ padding: 0 }}
    >
      {props.open && (
        <ViewModalFields
          item={props.item}
          open={props.open}
          setOpen={props.setOpen}
          type={props.type}
        />
      )}
    </Drawer>
  );
};
