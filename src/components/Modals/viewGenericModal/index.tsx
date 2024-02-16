/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, Spin } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ViewModalFields } from "./viewGenericModalFields";

interface viewProps {
  modalName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  item: any;
}

export const ViewModal = ({
  open,
  setOpen,
  modalName,
  loading,
  item,
}: viewProps) => {
  const { t } = useTranslation();

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      bodyStyle={{ overflowX: "hidden", padding: 0 }}
      title={modalName}
    >
      {loading ? (
        <Spin tip={t("messages.loading")} />
      ) : (
        <ViewModalFields item={item} />
      )}
    </Drawer>
  );
};
