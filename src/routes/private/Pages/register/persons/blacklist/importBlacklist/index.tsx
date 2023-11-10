/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppstoreAddOutlined,
  DownloadOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Toast } from "@src/components/Toast";
import { useUpdatePersonsBlacklist } from "@src/services/register/persons/blacklist/uploadBlacklistFile";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputRef,
  Popconfirm,
  Row,
  Table,
  Upload,
  notification,
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { unparse } from "papaparse";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCSVDownloader, usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  CPF: string;
  REASON: string;
  DESCRIPTION: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export const ImportPersonsBlacklist = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { readRemoteFile } = usePapaParse();
  const initialData: DataType[] = [
    {
      key: "1",
      CPF: "11111111111",
      REASON: "Fraude",
      DESCRIPTION: "Solicitado pelo merchant xyz",
    },
  ];
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [body, setBody] = useState<{ content: string }>({ content: "" });
  const { error, isLoading, isSuccess, mutate } =
    useUpdatePersonsBlacklist(body);
  const uploadRef = useRef<HTMLButtonElement | null>(null);
  const { CSVDownloader } = useCSVDownloader();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = () => {
    const BtnNavigate = (
      <Button
        onClick={() =>
          navigate("/register/person/person_blacklist/person_blacklist_uploads")
        }
      >
        Uploads
      </Button>
    );
    api.info({
      message: t("messages.creating_csv"),
      description: t("messages.creating_csv_message"),
      duration: 0,
      btn: BtnNavigate,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      openNotificationWithIcon();
    }
  }, [error, isSuccess]);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "CPF",
      dataIndex: "CPF",
      width: "30%",
      editable: true,
    },
    {
      title: t("table.reason"),
      dataIndex: "REASON",
      editable: true,
    },
    {
      title: t("table.description"),
      dataIndex: "DESCRIPTION",
      editable: true,
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, record: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm
          title={t("messages.are_you_sure", {
            action: t("messages.delete").toLocaleLowerCase(),
            itens: t("table.row").toLocaleLowerCase(),
          })}
          onConfirm={() => handleDelete(record?.key)}
          cancelText={t("messages.no_cancel")}
          okText={t("messages.yes_delete")}
        >
          <a>{t("messages.delete")}</a>
        </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: dataSource.length + 1,
      CPF: "11111111111",
      REASON: "Fraude",
      DESCRIPTION: "Solicitado pelo merchant xyz",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleUpload = () => {
    const csvHeader = ["CPF", "REASON", "DESCRIPTION"];

    const csvData = unparse({
      fields: csvHeader,
      data: dataSource,
    });
    const base64Encoded = btoa(csvData.replace(/(\r\n|\n|\r)/gm, "\n"));

    setBody({ content: base64Encoded });
  };

  useEffect(() => {
    if (body.content) {
      mutate();
      setBody({ content: "" });
    }
  }, [body]);

  return (
    <Row style={{ padding: 25 }}>
      {contextHolder}
      <Col span={24} style={{ marginBottom: 8 }}>
        <Row gutter={[8, 8]} style={{ width: "100%" }}>
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 4 }}>
            <Button
              style={{
                width: "100%",
                minWidth: "100%",
              }}
              size="large"
              icon={<UploadOutlined />}
              onClick={() => uploadRef && uploadRef.current?.click()}
            >
              {t("table.upload_file")}
            </Button>
            <Upload
              multiple={false}
              style={{ minWidth: "100%", display: "none" }}
              action=""
              onRemove={() => setDataSource(initialData)}
              beforeUpload={(file: any) => {
                readRemoteFile(file, {
                  header: true,
                  complete: (results) => {
                    setDataSource(
                      results?.data?.map((row: any, i) => {
                        return { ...row, key: i + 1 };
                      })
                    );
                  },
                  download: true,
                });

                return false;
              }}
            >
              <button
                ref={uploadRef}
                style={{
                  width: "100%",
                  minWidth: "100%",
                  display: "none",
                }}
              >
                {t("table.upload_file")}
              </button>
            </Upload>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 4 }}>
            <Button
              size="large"
              onClick={handleAdd}
              type="primary"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <AppstoreAddOutlined /> {t("table.add_row")}
            </Button>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            lg={{ span: 4 }}
            style={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <CSVDownloader
              filename="sample_file"
              bom
              config={{
                delimiter: ";",
              }}
              data={[
                {
                  CPF: 11111111111,
                  REASON: "Fraude",
                  DESCRIPTION: "Solicitado pelo merchant xyz",
                },
                {
                  CPF: 22222222222,
                  REASON: "Administrativo",
                  DESCRIPTION: "Solicitado pelo merchant xyz",
                },
                {
                  CPF: 33333333333,
                  REASON: "Interno",
                  DESCRIPTION: "Solicitado pelo merchant xyz",
                },
                {
                  CPF: 44444444444,
                  REASON: "Morte",
                  DESCRIPTION: "Solicitado pelo merchant xyz",
                },
              ]}
            >
              <a>
                <DownloadOutlined style={{ fontSize: 18, marginRight: 8 }} />
                {t("actions.download")} {t("buttons.sample_file")}
              </a>
            </CSVDownloader>
          </Col>
          <Col xs={{ span: 0 }} md={{ span: 0 }} lg={{ span: 8 }} />
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 4 }}>
            <Button
              size="large"
              type="dashed"
              disabled={!dataSource.length}
              onClick={handleUpload}
              loading={isLoading}
              style={{
                marginBottom: 16,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <SendOutlined style={{ fontSize: 16 }} /> Confirmar upload
            </Button>
          </Col>
        </Row>
      </Col>

      <Col span={24} style={{ overflow: "auto" }}>
        <Table
          loading={isLoading}
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
          locale={{
            emptyText: (
              <Empty
                style={{ padding: 15, paddingBottom: 30 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("messages.empty_table_data")}
              />
            ),
          }}
        />
      </Col>

      <Toast
        error={error}
        success={isSuccess}
        actionError={t("messages.upload")}
        actionSuccess={t("messages.uploaded")}
      />
    </Row>
  );
};
