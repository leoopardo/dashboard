/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import useDebounce from "@utils/useDebounce";
import { EditOutlined, EyeFilled, UserAddOutlined } from "@ant-design/icons";

import { ViewModal } from "@src/components/Modals/viewGenericModal";
import {
  UpdateCategoryInterface,
  useUpdateOrganizationCategory,
} from "@src/services/register/organization/categories/updateCategorie";
import { Toast } from "@src/components/Toast";
import { useGetPartners } from "@src/services/register/partner/getPartners";
import {
  PartnerItem,
  PartnerQuery,
} from "@src/services/types/register/partners/partners.interface";
import { useCreatePartner } from "@src/services/register/partner/createPartner";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";

const INITIAL_QUERY: PartnerQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Partners = () => {
  const [query, setQuery] = useState<PartnerQuery>(INITIAL_QUERY);
  const { t } = useTranslation();

  const {
    PartnersData,
    PartnersDataError,
    isPartnersDataFetching,
    refetchPartnersData,
  } = useGetPartners(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isUpdateCategorieModalOpen, setIsUpdateCategorieModalOpen] =
    useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PartnerItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [createBody, setCreateBody] = useState<PartnerItem>({
    name: "",
    cnpj: "",
    country: "",
    responsible_name: "",
  });
  const [updateBody, setUpdateBody] = useState<PartnerItem>({
    ...currentItem,
    partner_id: currentItem?.id,
  });

  const { PartnerIsLoading, PartnerMutate, PartnerError, PartnerIsSuccess } =
    useCreatePartner(createBody);

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdatePartner(updateBody);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "status", type: "status" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    refetchPartnersData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.name;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      partner_id: currentItem?.id,
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
            style={{ width: "100%", height: 40 }}
            loading={isPartnersDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            size="large"
            placeholder={t("table.name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isPartnersDataFetching}
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
            loading={isPartnersDataFetching}
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
            {`${t("buttons.create")} ${t("buttons.new_partner")}`}
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
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateCategorieModalOpen(true);
                },
              },
            ]}
            data={PartnersData}
            items={PartnersData?.items}
            error={PartnersDataError}
            columns={columns}
            loading={isPartnersDataFetching}
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
          haveInitialDate
          filters={["start_date", "end_date", "status"]}
          refetch={refetchPartnersData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isNewCategorieModal && (
        <MutateModal
          type="create"
          open={isNewCategorieModal}
          setOpen={setIsNewCategorieModal}
          fields={[
            { label: "name", required: true },
            { label: "cnpj", required: true },
            { label: "cellphone", required: false },
            { label: "email", required: false },
            { label: "country", required: true },
          ]}
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
          loading={isPartnersDataFetching}
          modalName={`${t("menus.partner")}: ${currentItem?.name}`}
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