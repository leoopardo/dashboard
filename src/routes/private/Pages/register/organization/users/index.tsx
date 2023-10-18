/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  EyeFilled,
  InfoCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ValidateToken } from "@components/ValidateToken";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetRowsOrganizationUsers } from "@services/register/organization/users/getUsers";
import { useUpdateOrganizationUser } from "@services/register/organization/users/updateUser";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateOrganizationReports } from "@src/services/reports/register/organization/createUserReports";
import { OrganizationUserQuery } from "@src/services/types/register/organization/organizationUsers.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Input, Tooltip, Tour, TourProps, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewUserInterface, NewUserModal } from "./components/newUserModal";

const INITIAL_QUERY: OrganizationUserQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const OrganizationUser = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<OrganizationUserQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const { UsersData, UsersDataError, isUsersDataFetching, refetchUsersData } =
    useGetRowsOrganizationUsers(query);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewUserModal, setIsNewUserModal] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [updateUserBody, setUpdateUserBody] = useState<NewUserInterface | null>(
    null
  );
  const [isValidateTokenOpen, setIsValidateTokenOpen] =
    useState<boolean>(false);
  const [tokenState, setTokenState] = useState<string>("");
  const { updateSuccess, updateError, updateMutate, updateReset } =
    useUpdateOrganizationUser({
      ...updateUserBody,
      validation_token: tokenState,
    });
  const {
    OrganizationReportsError,
    OrganizationReportsIsLoading,
    OrganizationReportsIsSuccess,
    OrganizationReportsMutate,
  } = useCreateOrganizationReports(query);
  const [action, setAction] = useState<"create" | "update">("create");

  useEffect(() => {
    refetchUsersData();
  }, [query]);

  const handleUpdateTokenValidate = () => {
    updateMutate();
  };

  // TUOR -----------------------------------------------
  
  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refId = useRef(null);
  const refName = useRef(null);
  const refGroup = useRef(null);
  const refStatus = useRef(null);
  const refEmail = useRef(null);
  const refCreatedAt = useRef(null);
  const steps: TourProps["steps"] = [
    {
      title: "Usuários de organização.",
      description: "Aqui você gerencia os usuários da sua organização.",
    },
    {
      title: "Filtros de pesquisa.",
      description: "Aplique filtros específicos na pesquisa por usuário.",
      target: () => ref1.current,
    },
    {
      title: "Pesquisa por nome.",
      description: "Procure determinado usuário pelo nome.",
      target: () => ref2.current,
    },
    {
      title: "Remoção dos filtros.",
      description:
        "Remova os filtros aplicados e volte a busca para o estado inicial.",
      target: () => ref3.current,
    },
  ];

  if (permissions.register.paybrokers.users.paybrokers_user_create) {
    steps.push({
      title: "Cadastre usuários.",
      description:
        "Cadastre novos usuários para acessar o painel da sua organização e defina suas permissões.",
      target: () => ref4.current,
    });
  }
  if (permissions.register.paybrokers.users.paybrokers_user_export_csv) {
    steps.push({
      title: "Gere relatórios",
      description: (
        <Typography>
          Gere relatórios dos usuários da sua organização de acordo com os
          filtros selecionados. O relatório poderá ser baixado na pagina:{" "}
          <Typography.Link
            href="/register/organization/organization_reports/organization_reports_users"
            target="_blank"
          >
            Organização | Relatórios | Usuários
          </Typography.Link>
        </Typography>
      ),
      target: () => ref5.current,
    });
  }

  steps.push(
    {
      title: "ID",
      description:
        "Número de identificação do usuário junto ao cadastro da Organização",
      target: () => refId.current,
    },
    {
      title: "Nome",
      description: "Nome do usuário",
      target: () => refName.current,
    },
    {
      title: "Grupo",
      description: "Grupo de acessos e permissões que o usuário está vinculado",
      target: () => refGroup.current,
    },
    {
      title: "Email",
      description: "Email de cadastro do usuário.",
      target: () => refEmail.current,
    },
    {
      title: "Situação",
      description: "Situação do cadastro do usuário (ativo ou inativo).",
      target: () => refStatus.current,
    },
    {
      title: "Criado em",
      description: "Data de criação do usuário",
      target: () => refCreatedAt.current,
    }
  );
  // TUOR -----------------------------------------------

  return (
    <Grid container style={{ padding: "25px" }}>
      <Tour
        open={isTuorOpen}
        onClose={() => setIsTuorOpen(false)}
        steps={steps}
        animated
      />
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref1}
            size="large"
            style={{ width: "100%" }}
            loading={isUsersDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={7} lg={9}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid
          xs={12}
          md={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip title="Ajuda">
            <Button
              type="link"
              onClick={() => setIsTuorOpen((state) => !state)}
            >
              <InfoCircleOutlined />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4} ref={ref2}>
          <Input.Search
            size="large"
            value={search}
            placeholder={t("table.name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            onSearch={() => setQuery((state) => ({ ...state, name: search }))}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            ref={ref3}
            type="dashed"
            loading={isUsersDataFetching}
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
        {permissions.register.paybrokers.users.paybrokers_user_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              ref={ref4}
              type="primary"
              loading={isUsersDataFetching}
              onClick={() => {
                setAction("create");
                setIsNewUserModal(true);
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
              {`${t("buttons.create")} ${t("buttons.new_user")}`}
            </Button>
          </Grid>
        )}
        {permissions.register.paybrokers.users.paybrokers_user_export_csv && (
          <Grid item xs={12} md="auto" ref={ref5}>
            <ExportReportsModal
              disabled={!UsersData?.total || UsersDataError}
              mutateReport={() => OrganizationReportsMutate()}
              error={OrganizationReportsError}
              success={OrganizationReportsIsSuccess}
              loading={OrganizationReportsIsLoading}
              reportPath="/register/organization/organization_reports/organization_reports_users"
            />
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
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
              permissions.register.paybrokers.users.paybrokers_user_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  updateReset();
                  setAction("update");
                  setIsNewUserModal(true);
                },
              },
            ]}
            data={UsersData}
            items={UsersData?.items}
            error={UsersDataError}
            columns={[
              { name: "id", type: "id", sort: true, key: refId },
              { name: "name", type: "text", sort: true, key: refName },
              {
                name: ["permission_group", "name"],
                head: "group",
                type: "text",
                key: refGroup,
              },
              { name: "email", type: "text", key: refEmail },
              { name: "status", type: "status", key: refStatus },
              {
                name: "created_at",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
            loading={isUsersDataFetching}
            label={["name", "username"]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date", "status"]}
          refetch={refetchUsersData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isNewUserModal && (
        <NewUserModal
          action={action}
          open={isNewUserModal}
          setOpen={setIsNewUserModal}
          currentUser={currentItem}
          setCurrentUser={setCurrentItem}
          setUpdateBody={setUpdateUserBody}
          setIsValidateTokenOpen={setIsValidateTokenOpen}
        />
      )}
      {isValidateTokenOpen && (
        <ValidateToken
          action="USER_UPDATE"
          body={updateUserBody}
          open={isValidateTokenOpen}
          setIsOpen={setIsValidateTokenOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          success={updateSuccess}
          error={updateError}
          submit={handleUpdateTokenValidate}
        />
      )}

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updateError}
        success={updateSuccess}
      />
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isUsersDataFetching}
          modalName={`${t("modal.user")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Grid>
  );
};
