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
import { queryClient } from "@src/services/queryClient";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";
import { useCreatePerson } from "@src/services/register/persons/persons/createPerson";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { useCreatePersonsReports } from "@src/services/reports/register/persons/persons/createPersonReports";
import { useGetPersonReportFields } from "@src/services/reports/register/persons/persons/getPersonReportFields";
import {
  PersonsItem,
  PersonsQuery,
} from "@src/services/types/register/persons/persons.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Col, Row, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const INITIAL_QUERY: PersonsQuery = {
  limit: 25,
  page: 1,
  sort_field: "name",
  sort_order: "DESC",
};

export const Persons = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [query, setQuery] = useState<PersonsQuery>(INITIAL_QUERY);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isNewModal, setIsNewModal] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PersonsItem | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const [createBody, setCreateBody] = useState<{ cpf: string }>({
    cpf: "",
  });
  const [updateBody, setUpdateBody] = useState<PersonsItem>({
    ...currentItem,
  });
  const [searchOption, setSearchOption] = useState<
    "cpf" | "name" | "email" | "cellphone" | undefined
  >(undefined);

  const { fields } = useGetPersonReportFields();

  const {
    PersonsData,
    PersonsDataError,
    isPersonsDataFetching,
    refetchPersonsData,
  } = useGetPersons(query);

  const {
    PersonsReportsError,
    PersonsReportsIsLoading,
    PersonsReportsIsSuccess,
    PersonsReportsMutate,
    PersonsReportsData
  } = useCreatePersonsReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { PersonIsLoading, PersonMutate, PersonError, PersonIsSuccess, reset } =
    useCreatePerson(createBody);

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdatePartner(updateBody);

  const columns: ColumnInterface[] = [
    { name: "cpf", type: "document" },
    { name: "situation_text", type: "text" },
    { name: "name", type: "text" },
    { name: "birth_date", type: "birth" },
    { name: "mother_name", type: "text" },
    { name: "black_list", type: "boolean" },
    { name: "flag_pep", type: "boolean" },
    { name: "flag_aux_gov", type: "boolean" },
    { name: "flag_alert", type: "text" },
    { name: "updatedAt", type: "date" },
  ];

  useEffect(() => {
    refetchPersonsData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
    });
  }, [currentItem]);
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
            loading={isPersonsDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <FilterChips initial_query={INITIAL_QUERY}
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
                  delete q[
                    searchOption as "name" | "cpf" | "email" | "cellphone"
                  ];
                  setQuery(q);
                  setSearchOption(undefined);
                }}
                style={{ width: "65%" }}
                size="large"
                onChange={(value) => setSearchOption(value)}
                value={searchOption}
                placeholder={t("input.options")}
                options={[
                  { value: "name", label: t("table.name") },
                  { value: "cellphone", label: t("table.cellphone") },
                  { value: "cpf", label: t("table.cpf") },
                  { value: "email", label: t("table.email") },
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
                { value: "name", label: t("table.name") },
                { value: "cellphone", label: t("table.cellphone") },
                { value: "cpf", label: t("table.cpf") },
                { value: "email", label: t("table.email") },
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
            loading={isPersonsDataFetching}
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
              loading={isPersonsDataFetching}
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
              {`${t("buttons.create")} ${t("buttons.person")}`}
            </Button>
          </Col>
        )}

        {permissions?.register?.person?.person?.person_person_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 2 }}>
            <Tooltip
              placement="topRight"
              title={
                PersonsData?.total === 0 || PersonsDataError
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
                disabled={PersonsData?.total === 0 || PersonsDataError}
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
            refetch={refetchPersonsData}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: (item) =>
                  navigate(
                    `${item?.cpf
                      ?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                      .split(".")
                      .join("%20")}`,
                    { state: item }
                  ),
              },
              permissions?.register?.person?.person?.person_person_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate(
                    `update/${item?.cpf
                      ?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                      .split(".")
                      .join("%20")}`,
                    { state: item }
                  );
                },
              },
            ]}
            data={PersonsData}
            items={PersonsData?.items}
            error={PersonsDataError}
            columns={columns}
            loading={isPersonsDataFetching}
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
          "flag_pep",
          "flag_aux_gov",
          "flag_alert",
          "state",
          "city",
          "gender",
        ]}
        refetch={refetchPersonsData}
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
        fields={[{ label: "cpf", required: true }]}
        body={createBody}
        setBody={setCreateBody}
        modalName={t("modal.new_person")}
        submit={PersonMutate}
        submitLoading={PersonIsLoading}
        error={PersonError}
        success={PersonIsSuccess}
        clear={reset}
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
        loading={isPersonsDataFetching}
        modalName={`${t("modal.person")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={PersonsData?.total === 0 || PersonsReportsError}
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
        reportName="persons"
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
        error={PersonError}
        success={PersonIsSuccess}
      />
    </Row>
  );
};
