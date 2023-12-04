import { Drawer } from "antd";
import Tree, { DataNode } from "antd/es/tree";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface PermissionsModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group?: any;
}

export const PermissionsModal = ({
  open,
  setOpen,
  group,
}: PermissionsModalProps) => {
  const { t } = useTranslation();
  const treeData: DataNode[] = [
    {
      title: "Dashboard",
      key: "0-0",
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          children: [
            {
              title: "leaf",
              key: "0-0-0-0",
            },
            {
              title: "leaf",
              key: "0-0-0-1",
            },
          ],
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          children: [
            {
              title: <span style={{ color: "#1677ff" }}>sss</span>,
              key: "0-0-1-0",
            },
          ],
        },
      ],
    },
    {
        title: "Cadastros",
        key: "0-1",
        children: [
          {
            title: "parent 1-1",
            key: "0-1-0",
            children: [
              {
                title: "leaf",
                key: "0-1-0-0",
              },
              {
                title: "leaf",
                key: "0-1-0-1",
              },
            ],
          },
          {
            title: "parent 1-1",
            key: "0-1-1",
            children: [
              {
                title: <span style={{ color: "#1677ff" }}>sss</span>,
                key: "0-1-1-0",
              },
            ],
          },
        ],
      },
      {
        title: "Movimentações",
        key: "0-2",
        children: [
          {
            title: "parent 1-0",
            key: "0-2-0",
            children: [
              {
                title: "leaf",
                key: "0-2-0-0",
              },
              {
                title: "leaf",
                key: "0-2-0-1",
              },
            ],
          },
          {
            title: "parent 1-1",
            key: "0-2-1",
            children: [
              {
                title: <span style={{ color: "#1677ff" }}>sss</span>,
                key: "0-2-1-0",
              },
            ],
          },
        ],
      },
  ];
  return (
    <Drawer
      title={`${t("table.permissions")}: ${group?.name}`}
      onClose={() => setOpen(false)}
      open={open}
    >
      <Tree
    
      treeData={treeData}
    />
    </Drawer>
  );
};
