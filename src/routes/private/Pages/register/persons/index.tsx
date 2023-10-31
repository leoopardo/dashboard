/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  UserAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";
import { useCreatePerson } from "@src/services/register/persons/persons/createPerson";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { useCreatePersonsReports } from "@src/services/reports/register/persons/persons/createPersonReports";
import {
  PersonsItem,
  PersonsQuery,
} from "@src/services/types/register/persons/persons.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const INITIAL_QUERY: PersonsQuery = {
  limit: 25,
  page: 1,
  sort_field: "name",
  sort_order: "DESC",
};

export const Persons = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const [query, setQuery] = useState<PersonsQuery>(INITIAL_QUERY);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isNewModal, setIsNewModal] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PersonsItem | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [createBody, setCreateBody] = useState<{ cpf: string }>({
    cpf: "",
  });
  const [updateBody, setUpdateBody] = useState<PersonsItem>({
    ...currentItem,
  });
  const [searchOption, setSearchOption] = useState<
    "cpf" | "name" | "email" | "cellphone" | undefined
  >(undefined);

  const { t } = useTranslation();
  const navigate = useNavigate();

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
  } = useCreatePersonsReports(query);

  const { PersonIsLoading, PersonMutate, PersonError, PersonIsSuccess } =
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
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isPersonsDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
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
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Search
            query={query}
            setQuery={setQuery}
            searchOption={searchOption}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.register.person.person.person_person_create && (
          <Grid item xs={12} md={3} lg={2}>
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
            >
              <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
              {`${t("buttons.create")} ${t("buttons.person")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.person.person.person_person_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!PersonsData?.total || PersonsReportsError}
              mutateReport={() => PersonsReportsMutate()}
              error={PersonsReportsError}
              success={PersonsReportsIsSuccess}
              loading={PersonsReportsIsLoading}
              reportPath="/register/person/person_reports/person_persons_reports"
            />
          </Grid>
        )}
        <Grid
          container
          item
          xs={12}
          md="auto"
          lg={1}
          style={{ marginLeft: "auto" }}
        >
          <Button
            style={{
              width: "100%",
              height: 40,
            }}
            loading={isPersonsDataFetching}
            shape="round"
            type="dashed"
            onClick={refetchPersonsData}
          >
            {!isPersonsDataFetching && <ReloadOutlined />}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
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
              permissions.register.person.person.person_person_update && {
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
            label={["name", "description"]}
            removeTotal
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
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
      )}

      {isNewModal && (
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
        />
      )}
      {isUpdateModalOpen && (
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
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isPersonsDataFetching}
          modalName={`${t("modal.person")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
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
        error={PersonError}
        success={PersonIsSuccess}
      />
    </Grid>
  );
};
