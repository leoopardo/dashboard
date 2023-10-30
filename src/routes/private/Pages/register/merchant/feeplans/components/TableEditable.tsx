/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Typography,
  Table,
  Space,
} from "antd";
import { IDepositFeePlansDetails } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useUpdateMerchantFeePlanDetails } from "@src/services/register/merchant/feePlans/updateFeePlansDetails";
import { useDeleteFeePlanDetail } from "@src/services/register/merchant/feePlans/deleteFeePlansDetails";
import { useTranslation } from "react-i18next";

interface TableEditableProps {
  feeDetails: IDepositFeePlansDetails[] | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: IDepositFeePlansDetails;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  children,
  ...restProps
}) => {
  const inputNode = <InputNumber style={{ width: "100%" }} />;

  return (
    <>
      {editing ? (
        <td {...restProps} style={{ margin: 0, padding: 1 }}>
          <Form.Item
            name={dataIndex}
            style={{ margin: 0, padding: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        </td>
      ) : (
        <td
          {...restProps}
          style={{ margin: 0, paddingLeft: 5, paddingRight: 5 }}
        >
          {children}
        </td>
      )}
    </>
  );
};

const TableEditable: React.FC<TableEditableProps> = ({ feeDetails }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [data, setData] = useState(feeDetails);
  const [body, setBody] = useState<IDepositFeePlansDetails>();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [rowId, setRowId] = useState<number | undefined>();
  const { updateMutate, updateIsSuccess } =
    useUpdateMerchantFeePlanDetails(body);
  const isEditing = (record: IDepositFeePlansDetails) =>
    record.id === editingKey;
  const { deleteFeePlanDetailMutate, deleteFeePlanDetailIsSuccess } =
    useDeleteFeePlanDetail(rowId);

  const edit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(Number(record?.id));
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const confirm = () => {
    updateMutate();
  };

  const save = async (id?: number) => {
    const row = (await form.validateFields()) as IDepositFeePlansDetails;
    setBody({ ...row, fee_plans_details_id: id });
  };

  const handleDelete = () => {
    deleteFeePlanDetailMutate();
  };

  const columns = [
    {
      title: t("table.fee"),
      dataIndex: "range_fee",
      width: "5%",
      editable: true,
    },
    {
      title: t("input.minimum_value"),
      dataIndex: "range_value",
      width: "5%",
      editable: true,
    },
    {
      title: t("table.limit"),
      dataIndex: "range_limit",
      width: "5%",
      editable: true,
    },
    {
      title: "",
      width: "15%",
      dataIndex: "",
      render: (_: any, record: IDepositFeePlansDetails) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Popconfirm
              title={t("messages.are_you_sure", {
                action: t("actions.edit").toLocaleLowerCase(),
                itens: t("table.fee").toLowerCase(),
              })}
              onConfirm={confirm}
            >
              <CheckOutlined
                onClick={() => save(record?.id)}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "green",
                }}
              />
            </Popconfirm>
            <CloseOutlined
              onClick={cancel}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "red",
              }}
            />
          </Space>
        ) : (
          <Space size="middle">
            <EditOutlined
              onClick={() => edit(record)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "blue",
              }}
            />
            <Popconfirm
              title={t("messages.are_you_sure", {
                action: t("actions.delete").toLocaleLowerCase(),
                itens: t("table.fee").toLowerCase(),
              })}
              onConfirm={() => handleDelete()}
            >
              <DeleteOutlined
                onClick={() => setRowId(record.id)}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "red",
                }}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns?.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IDepositFeePlansDetails) => ({
        record,
        inputType: col.dataIndex === "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    setData(feeDetails);
  }, [feeDetails]);

  useEffect(() => {
    updateIsSuccess && setEditingKey(null);
  }, [updateIsSuccess]);

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data as any}
        columns={mergedColumns}
        rowKey="id"
        pagination={{ pageSize: 2, onChange: cancel }}
      />
    </Form>
  );
};

export default TableEditable;
