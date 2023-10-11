/* eslint-disable @typescript-eslint/no-explicit-any */
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { Toast } from "@src/components/Toast";
import { useUpdateAggregator } from "@src/services/register/aggregator/updateAggregator";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { AggregatorItem } from "@src/services/types/register/aggregators/aggregators.interface";
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useLocation } from "react-router-dom";

export const UpdateAggregator = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [aggregatorBody, setAggregatorBody] = useState<AggregatorItem>({
    aggregator_id: location.state.id,
    name: location.state.name,
    cnpj: location.state.cnpj,
    cellphone: location.state.cellphone,
    email: location.state.email,
    country: location.state.country,
  });
  const { Countries } = useGetrefetchCountries();

  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const {
    UpdateError,
    UpdateIsLoading,
    UpdateMutate,
    UpdateIsSuccess,
    UpdateReset,
  } = useUpdateAggregator(aggregatorBody);

  const handleChangeAggregator = (event: any) => {
    setAggregatorBody((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("aggregator_data"),
      children: (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={location.state}
          onFinish={() => UpdateMutate()}
        >
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required", {
                        field: t(`input.name`),
                      }) || "",
                  },
                ]}
              >
                <Input
                  name="name"
                  size="large"
                  value={aggregatorBody?.name}
                  onChange={handleChangeAggregator}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.cnpj")}
                name="cnpj"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required", {
                        field: t(`input.cnpj`),
                      }) || "",
                  },
                ]}
              >
                <ReactInputMask
                  value={aggregatorBody?.cnpj}
                  mask="99.999.999/9999-99"
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d]/g, "");
                    if (!value) {
                      delete aggregatorBody?.cnpj;
                      return;
                    }
                    setAggregatorBody((state: any) => ({
                      ...state,
                      cnpj: value,
                    }));
                  }}
                >
                  <Input size="large" />
                </ReactInputMask>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item label={t("table.cellphone")} name="name">
                <CellphoneInput
                  body={aggregatorBody}
                  setBody={setAggregatorBody}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.email")}
                name="email"
                rules={[
                  {
                    type: "email",
                  },
                ]}
              >
                <Input
                  name="email"
                  size="large"
                  value={aggregatorBody?.email}
                  onChange={handleChangeAggregator}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item label={t("table.country")} name="country">
                <AutoComplete
                  options={Countries?.map((country) => {
                    return {
                      label: (
                        <Typography>
                          <Avatar src={country.flags.svg} />
                          {country?.cca2}
                        </Typography>
                      ),
                      value: country.cca2,
                    };
                  })}
                  size="large"
                  value={aggregatorBody?.country}
                  onChange={(value) =>
                    setAggregatorBody((state) => ({ ...state, country: value }))
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              width: "100%",
            }}
          >
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Button
                size="large"
                style={{
                  width: "100%",
                }}
                type="primary"
                onClick={() => submitRef.current?.click()}
                loading={UpdateIsLoading}
              >
                {t("buttons.update")} {t("table.aggregator")}
              </Button>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button type="submit" ref={submitRef} style={{ display: "none" }}>
              Submit
            </button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <Row style={{ padding: 25 }}>
      <Col span={24}>
        <Tabs defaultActiveKey="1" items={items} />
      </Col>
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
    </Row>
  );
};
