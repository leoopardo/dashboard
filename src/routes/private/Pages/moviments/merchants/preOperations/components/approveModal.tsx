/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BlockOutlined,
  DownOutlined,
  OneToOneOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface IProp {
  setIsValidateTokenOpen: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
  loading: boolean;
  disabled: boolean;
  selectedRows: any[];
  query: any;
  setApproveAll: Dispatch<SetStateAction<any>>;
  total?: number;
}

export const ApproveModal: FC<IProp> = ({
  setIsValidateTokenOpen,
  loading,
  disabled,
  reset,
  selectedRows,
  query,
  setApproveAll,
  total,
}) => {
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    {
      label: `${t("titles.operation_approve")} (${selectedRows.length})`,
      key: "1",
      icon: <OneToOneOutlined style={{ fontSize: 20 }} />,
      disabled: disabled,
      onClick: () => {
        setIsValidateTokenOpen(true);
      },
    },
    {
      label: `${t("titles.operation_approve_all")} (${total || 0})`,
      key: "2",
      icon: <BlockOutlined style={{ fontSize: 22 }} />,
      disabled: !total,
      onClick: () => {
        setApproveAll(query);
        setIsValidateTokenOpen(true);
      },
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomLeft"
      arrow
      onOpenChange={() => reset()}
    >
      <Button size="large" style={{ width: "100%" }} loading={loading}>
        {t("titles.Approvement")}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
