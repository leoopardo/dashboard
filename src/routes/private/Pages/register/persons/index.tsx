/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import useDebounce from "@utils/useDebounce";
import { EditOutlined, EyeFilled, UserAddOutlined } from "@ant-design/icons";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { useCreatePartner } from "@src/services/register/partner/createPartner";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";
import {
  PersonsItem,
  PersonsQuery,
} from "@src/services/types/register/persons/persons.interface";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { useNavigate } from "react-router-dom";

const INITIAL_QUERY: PersonsQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Persons = () => {
  const [query, setQuery] = useState<PersonsQuery>(INITIAL_QUERY);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isUpdateCategorieModalOpen, setIsUpdateCategorieModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PersonsItem | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [createBody, setCreateBody] = useState<PersonsItem>({
    cpf: "",
  });
  const [updateBody, setUpdateBody] = useState<PersonsItem>({
    ...currentItem,
  });
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [searchOption, setSearchOption] = useState<
    "cpf" | "name" | "email" | "cellphone" | null
  >(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    PersonsData,
    PersonsDataError,
    isPersonsDataFetching,
    refetchPersonsData,
  } = useGetPersons(query);

  const { PartnerIsLoading, PartnerMutate, PartnerError, PartnerIsSuccess } =
    useCreatePartner(createBody);

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdatePartner(updateBody);

  const columns: ColumnInterface[] = [
    { name: "cpf", type: "document" },
    { name: "situation_text", type: "text" },
    { name: "name", type: "text" },
    { name: "birth_date", type: "date" },
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
    if (searchOption) {
      setQuery((state) => ({ ...state, [searchOption]: debounceSearch }));
    }
  }, [debounceSearch]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
    });
  }, [currentItem]);

  useEffect(() => {
    if (isViewModalOpen) navigate(`${currentItem?.name}`);
  }, [isViewModalOpen]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            style={{ width: "100%", height: 40 }}
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
            placeholder="Opções"
            options={[
              { value: "name", label: t("table.name") },
              { value: "cellphone", label: t("table.cellphone") },
              { value: "cpf", label: t("table.cpf") },
              { value: "email", label: t("table.email") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Space.Compact style={{ width: "100%" }} size="large">
            <Input
              placeholder="Pesquisa"
              size="large"
              disabled={!searchOption}
              style={{ width: "100%" }}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </Space.Compact>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isPersonsDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearch("");
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
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isPersonsDataFetching}
            onClick={() => {
              setIsNewCategorieModal(true);
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
                onClick: () => setIsViewModalOpen(true),
              },
              {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateCategorieModalOpen(true);
                },
              },
            ]}
            data={PersonsData}
            items={PersonsData?.items}
            error={PersonsDataError}
            columns={columns}
            loading={isPersonsDataFetching}
            label={["name", "description"]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["initial_date", "final_date"]}
          refetch={refetchPersonsData}
          selectOptions={{}}
          startDateKeyName="initial_date"
          endDateKeyName="final_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isNewCategorieModal && (
        <MutateModal
          type="create"
          open={isNewCategorieModal}
          setOpen={setIsNewCategorieModal}
          fields={[{ label: "cpf", required: true }]}
          body={createBody}
          setBody={setCreateBody}
          modalName={t("modal.new_partner")}
          submit={PartnerMutate}
          submitLoading={PartnerIsLoading}
          error={PartnerError}
          success={PartnerIsSuccess}
        />
      )}
      {isUpdateCategorieModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateCategorieModalOpen}
          setOpen={setIsUpdateCategorieModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "cnpj", required: false },
            { label: "cellphone", required: false },
            { label: "email", required: false },
            { label: "country", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.update_category")}
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
        error={PartnerError}
        success={PartnerIsSuccess}
      />
    </Grid>
  );
};
