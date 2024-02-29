/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ViewModalFields } from "./ViewModalFields";
import { useMediaQuery } from "react-responsive";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id?: string | null;
}

export const ViewModal = (props: ViewModalProps) => {
  const isMobile = useMediaQuery({ maxWidth: 950 });
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
      size={isMobile ? "default" : "large"}
    >
      {props.open && (
        <ViewModalFields
          open={props.open}
          setOpen={props.setOpen}
          id={props.id}
        />
      )}
    </Drawer>
  );
};
