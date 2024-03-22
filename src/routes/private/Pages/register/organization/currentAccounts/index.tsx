/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { CustomTable } from "@src/components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { Button, Col, Row } from "antd";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import {
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { queryClient } from "@src/services/queryClient";
import { useMediaQuery } from "react-responsive";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { useTranslation } from "react-i18next";
import { Search } from "@src/components/Inputs/search";
import { FiltersModal } from "@src/components/FiltersModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useUpdateOrganizationsCurrentAccount } from "@src/services/reports/register/organization/updateCurrentAccount";
import { useGetOrganizationCurrentAccounts } from "@src/services/reports/register/organization/getCurrentAccounts";
import { useCreateOrganizationCurrentAccount } from "@src/services/reports/register/organization/createCurrentAccount";
import { Toast } from "@src/components/Toast";
import { UpdateUserModal } from "./components/UpdateAccount";

const INITIAL_QUERY: OrganizationBankStatementTotalsQuery = {};

export const CurrentAccountPage: FC = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const isSmallDesktop = useMediaQuery({ maxWidth: 1200 });
  const [currentItem, setCurrentItem] = useState<any>();
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [body, setBody] = useState<{ name: string; locked: boolean }>({
    locked: false,
    name: "",
  });
  const [query, setQuery] =
    useState<OrganizationBankStatementTotalsQuery>(INITIAL_QUERY);
  const [updateBody, setUpdateBody] = useState<{
    id?: string;
    name?: string;
    locked?: boolean;
  }>({});

  const {
    CurrentAccountData,
    isCurrentAccountDataFetching,
    CurrentAccountDataError,
    refetchCurrentAccountData,
  } = useGetOrganizationCurrentAccounts(query);

  const {
    createCurrentAccountError,
    createCurrentAccountIsLoading,
    createCurrentAccountIsSuccess,
    createCurrentAccountMutate,
    createCurrentAccountReset,
  } = useCreateOrganizationCurrentAccount(body);

  const {
    UpdateError,
    UpdateIsLoading,
    UpdateIsSuccess,
    UpdateMutate,
    UpdateReset,
  } = useUpdateOrganizationsCurrentAccount({
    ...updateBody,
    id: currentItem?.id,
  });

  useEffect(() => {
    if (UpdateIsSuccess) {
      setIsUpdateModalOpen(false);
      setUpdateBody({});
      UpdateReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateIsSuccess]);

  useEffect(() => {
    refetchCurrentAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      <Row
        align="middle"
        justify="start"
        gutter={[8, 8]}
        style={{ width: "100%" }}
      >
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isCurrentAccountDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Col>
      </Row>

      <Row align="middle" style={{ width: "100%" }} gutter={[8, 8]}>
        <Col
          xs={{ span: 24 }}
          md={{ span: 10 }}
          lg={{ span: isSmallDesktop ? 10 : 7 }}
        >
          <Search query={query} setQuery={setQuery} searchOption="name" />
        </Col>
        <Col
          xs={{ span: 24 }}
          md={{ span: 6 }}
          lg={{ span: isSmallDesktop ? 6 : 4 }}
        >
          <Button
            type="dashed"
            loading={isCurrentAccountDataFetching}
            danger
            size="large"
            onClick={() => {
              setQuery(INITIAL_QUERY);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
            icon={<FilterAltOffOutlinedIcon />}
          >
            {t("table.clear_filters")}
          </Button>
        </Col>

        {permissions?.register?.paybrokers?.account?.account_api_create && (
          <Col
            xs={{ span: 24 }}
            md={{ span: isSmallDesktop ? 8 : 6 }}
            lg={{ span: isSmallDesktop ? 8 : 6 }}
          >
            <Button
              type="primary"
              loading={isCurrentAccountDataFetching}
              onClick={() => {
                setIsCreateModalOpen(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            >
              {t("buttons.add_current_account")}
            </Button>
          </Col>
        )}
      </Row>

      <CustomTable
        query={query}
        setCurrentItem={setCurrentItem || {}}
        setQuery={setQuery}
        data={CurrentAccountData}
        items={CurrentAccountData?.items}
        error={CurrentAccountDataError}
        columns={[
          { name: "id", type: "document", head: "id", sort: true },
          { name: "name", type: "text", sort: true },
          { name: "locked", type: "boolean", sort: true },
          { name: "updated_at", type: "date", sort: true },
        ]}
        actions={[
          {
            id: "table-details-button",
            label: "details",
            icon: <EyeFilled style={{ fontSize: "20px" }} />,
            onClick: () => {
              setIsViewModalOpen(true);
            },
          },
          permissions?.register?.paybrokers?.account?.account_api_update && {
            id: "table-edit-button",
            label: "edit",
            icon: <EditOutlined style={{ fontSize: "20px" }} />,
            onClick: (item) => {
              setCurrentItem({
                id: item.id,
                name: item.name,
                locked: item.locked,
              });
              setIsUpdateModalOpen(true);
            },
          },
        ]}
        refetch={refetchCurrentAccountData}
        loading={false}
        removeTotal
      />

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["start_date", "end_date", "locked"]}
        refetch={refetchCurrentAccountData}
        selectOptions={{ locked: ["true", "false"] }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <ViewModal
        item={currentItem}
        loading={false}
        modalName={`${t("table.bank_acc_number")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <MutateModal
        type="create"
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
        fields={[{ label: "name", required: true }]}
        body={body}
        setBody={setBody}
        modalName={`${t("modal.add")} ${t(
          "table.bank_acc_number"
        ).toLowerCase()}`}
        submit={createCurrentAccountMutate}
        submitLoading={createCurrentAccountIsLoading}
        error={createCurrentAccountError}
        success={createCurrentAccountIsSuccess}
        clear={createCurrentAccountReset}
      />

      {isUpdateModalOpen && (
        <UpdateUserModal
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          currenItem={currentItem}
          setCurrentItem={setCurrentItem}
          setUpdateBody={setUpdateBody}
          submit={() => UpdateMutate()}
          loading={UpdateIsLoading}
        />
      )}

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={createCurrentAccountError}
        success={createCurrentAccountIsSuccess}
      />
    </Row>
  );
};
