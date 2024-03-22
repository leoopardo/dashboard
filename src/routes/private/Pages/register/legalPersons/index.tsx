/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { useGetCheckCnpj } from "@src/services/consult/persons/checkCNPJ";
import { queryClient } from "@src/services/queryClient";
import { useGetLegalPersons } from "@src/services/register/legalPersons/getPersons";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";
import { useCreateLegalPersonsReports } from "@src/services/reports/register/legalPersons/createPersonReports";
import { useGetLegalPersonReportFields } from "@src/services/reports/register/legalPersons/getPersonReportFields";
import { LegalPersonsQuery } from "@src/services/types/register/legalPersons/persons.interface";
import { PersonsItem } from "@src/services/types/register/persons/persons.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Col, Row, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const INITIAL_QUERY: LegalPersonsQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const LegalPersons = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [query, setQuery] = useState<LegalPersonsQuery>(INITIAL_QUERY);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isNewModal, setIsNewModal] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PersonsItem | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const [createBody, setCreateBody] = useState<{ cnpj: string }>({
    cnpj: "",
  });
  const [updateBody, setUpdateBody] = useState<PersonsItem>({
    ...currentItem,
  });
  const [searchOption, setSearchOption] = useState<
    "cnpj" | "business_name" | "email" | "cellphone" | undefined
  >(undefined);

  const { fields } = useGetLegalPersonReportFields();

  const {
    LegalPersonsData,
    LegalPersonsDataError,
    isLegalPersonsDataFetching,
    refetchLegalPersonsData,
  } = useGetLegalPersons(query);

  const {
    PersonsReportsError,
    PersonsReportsIsLoading,
    PersonsReportsIsSuccess,
    PersonsReportsMutate,
    PersonsReportsData,
  } = useCreateLegalPersonsReports({
    ...query,
    sort_field: undefined,
    sort_order: undefined,
    page: undefined,
    limit: undefined,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const {
    CheckCnpjData,
    isCheckCnpjDataFetching,
    refetchCheckCnpjData,
    CheckCnpjDataError,
    CheckCnpjDataSuccess,
    removeCnpj,
  } = useGetCheckCnpj(createBody.cnpj);

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdatePartner(updateBody);

  const columns: ColumnInterface[] = [
    { name: "cnpj", type: "document" },
    { name: "business_name", type: "text" },
    { name: "registration_status_description", type: "translate" },
    { name: "black_list", type: "boolean" },
    { name: "flag_pep", type: "boolean" },
    { name: "flag_alert", type: "text" },
  ];

  useEffect(() => {
    refetchLegalPersonsData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
    });
  }, [currentItem]);

  useEffect(() => {
    if (CheckCnpjDataSuccess)
      navigate(`${CheckCnpjData?.cnpj}`, { state: currentItem });
  }, [CheckCnpjDataSuccess]);
  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="start"
        style={{ width: "100%" }}
      >
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isLegalPersonsDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <FilterChips
            initial_query={INITIAL_QUERY}
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
          />
        </Col>
      </Row>

      <Row
        gutter={[8, 8]}
        align="middle"
        justify="start"
        style={{ width: "100%" }}
      >
        <Col xs={{ span: 24 }} md={{ span: 10 }}>
          {!isMobile ? (
            <Space.Compact style={{ width: "100%" }} size="large">
              <Select
                allowClear
                onClear={() => {
                  const q = { ...query };
                  delete q[searchOption as "cnpj" | "phone"];
                  setQuery(q);
                  setSearchOption(undefined);
                }}
                style={{ width: "65%" }}
                size="large"
                onChange={(value) => setSearchOption(value)}
                value={searchOption}
                placeholder={t("input.options")}
                options={[
                  { value: "business_name", label: t("table.business_name") },
                  { value: "cnpj", label: t("table.cnpj") },
                ]}
              />{" "}
              <Search
                query={query}
                setQuery={setQuery}
                searchOption={searchOption}
              />
            </Space.Compact>
          ) : (
            <Select
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => setSearchOption(value)}
              value={searchOption}
              placeholder={t("input.options")}
              options={[
                { value: "business_name", label: t("table.business_name") },
                { value: "phone", label: t("table.cellphone") },
                { value: "cnpj", label: t("table.cnpj") },
              ]}
            />
          )}
        </Col>
        {isMobile && (
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Search
              query={query}
              setQuery={setQuery}
              searchOption={searchOption}
            />
          </Col>
        )}
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            type="dashed"
            loading={isLegalPersonsDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(undefined);
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<FilterAltOffOutlinedIcon />}
          >
            {t("table.clear_filters")}
          </Button>
        </Col>
        {permissions?.register?.person?.person?.person_person_create && (
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Button
              type="primary"
              loading={isLegalPersonsDataFetching}
              onClick={() => {
                setIsNewModal(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<UserAddOutlined style={{ fontSize: 22 }} />}
            >
              {`${t("modal.add")} ${t("modal.person").toLowerCase()}`}
            </Button>
          </Col>
        )}

        {permissions?.register?.person?.person?.person_person_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 2 }}>
            <Tooltip
              placement="topRight"
              title={
                LegalPersonsData?.total === 0 || LegalPersonsDataError
                  ? t("messages.no_records_to_export")
                  : t("messages.export_csv")
              }
              arrow
            >
              <Button
                onClick={() => setIsExportReportsOpen(true)}
                style={{ width: "100%" }}
                shape="round"
                type="dashed"
                size="large"
                loading={PersonsReportsIsLoading}
                disabled={
                  LegalPersonsData?.total === 0 || LegalPersonsDataError
                }
                icon={<FileAddOutlined style={{ fontSize: 22 }} />}
              >
                CSV
              </Button>
            </Tooltip>
          </Col>
        )}
      </Row>

      <Row style={{ width: "100%" }}>
        <Col xs={24}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            refetch={refetchLegalPersonsData}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: (item) => navigate(`${item?.cnpj}`, { state: item }),
              },
              permissions?.register?.person?.person?.person_person_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate(`update/${item?.cnpj}`, { state: item });
                },
              },
            ]}
            data={LegalPersonsData}
            items={LegalPersonsData?.items}
            error={LegalPersonsDataError}
            columns={columns}
            loading={isLegalPersonsDataFetching}
            label={["name", "cpf"]}
            removeTotal
          />
        </Col>
      </Row>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={[
          "initial_date",
          "final_date",
          "black_list",
          "flag_alert",
          "state",
          "city",
        ]}
        refetch={refetchLegalPersonsData}
        selectOptions={{
          black_list: ["true", "false"],
          flag_pep: ["true", "false"],
          flag_aux_gov: ["true", "false"],
          flag_alert: ["0", "1", "2", "3", "4", "5"],
          gender: ["MALE", "FEMALE"],
        }}
        startDateKeyName="initial_date"
        endDateKeyName="final_date"
        initialQuery={INITIAL_QUERY}
      />

      <MutateModal
        type="create"
        open={isNewModal}
        setOpen={setIsNewModal}
        fields={[{ label: "cnpj", required: true }]}
        body={createBody}
        setBody={setCreateBody}
        modalName={`${t("modal.add")} ${t("modal.person").toLowerCase()}`}
        submit={refetchCheckCnpjData}
        submitLoading={isCheckCnpjDataFetching}
        error={CheckCnpjDataError}
        success={CheckCnpjDataSuccess}
        clear={removeCnpj}
        submitText={t("modal.add") || ""}
      />

      <MutateModal
        type="update"
        open={isUpdateModalOpen}
        setOpen={setIsUpdateModalOpen}
        fields={[
          { label: "name", required: false },
          { label: "cnpj", required: false },
          { label: "cellphone", required: false },
          { label: "email", required: false },
          { label: "country", required: false },
        ]}
        body={updateBody}
        setBody={setUpdateBody}
        modalName={t("modal.update_person")}
        submit={UpdateMutate}
        submitLoading={UpdateIsLoading}
        error={UpdateError}
        success={UpdateIsSuccess}
      />

      <ViewModal
        item={currentItem}
        loading={isLegalPersonsDataFetching}
        modalName={`${t("modal.person")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={LegalPersonsData?.total === 0 || PersonsReportsError}
        mutateReport={() => PersonsReportsMutate()}
        error={PersonsReportsError}
        success={PersonsReportsIsSuccess}
        loading={PersonsReportsIsLoading}
        reportPath="/register/person/person_reports/person_persons_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="legalPersons"
        url={PersonsReportsData?.url}
      />
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={CheckCnpjDataError}
        success={CheckCnpjDataSuccess}
      />
    </Row>
  );
};
