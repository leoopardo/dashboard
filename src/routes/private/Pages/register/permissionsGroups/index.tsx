import {
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { Search } from "@src/components/Inputs/search";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { useCreatePermissionGroup } from "@src/services/register/permissionGroups/createPermissionGroup";
import { useGetPermissionGroups } from "@src/services/register/permissionGroups/getPermissionGroups";
import {
  PermissionGroupBodyInterface,
  PermissionsGroupsItemInterface,
  PermissionsGroupsQueryInterface,
} from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { RemoveFiltersIcon } from "@src/styles/styles";
import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PermissionsModal } from "./components/permissionsModal/permissionsModal";
import { useUpdatePermissionGroup } from "@src/services/register/permissionGroups/updatePermissionGroup";

export const PermissionsGroups = () => {
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<PermissionsGroupsQueryInterface>({
    limit: 25,
    page: 1,
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] =
    useState<PermissionsGroupsItemInterface | null>(null);
  const [createGroupBody, setCreateGroupBody] =
    useState<PermissionGroupBodyInterface>({
      name: "",
      description: "",
      profile_id: undefined,
      status: "true",
    });
  const [updateGroupBody, setUpdateGroupBody] =
    useState<PermissionGroupBodyInterface>({
      name: "",
      description: "",
      profile_id: undefined,
      status: "true",
    });
  const {
    PermissionGroupsData,
    isPermissionGroupsDataFetching,
    PermissionGroupsDataError,
  } = useGetPermissionGroups(query);
  const {
    PermissionGroupError,
    PermissionGroupIsLoading,
    PermissionGroupIsSuccess,
    PermissionGroupMutate,
    data,
  } = useCreatePermissionGroup({ ...createGroupBody, status: "true" });
  const {
    UpdatePermissionGroupError,
    UpdatePermissionGroupIsLoading,
    UpdatePermissionGroupIsSuccess,
    UpdatePermissionGroupMutate,
  } = useUpdatePermissionGroup(updateGroupBody);

  useEffect(() => {
    if (data) {
      setCurrentItem(data);
      setIsPermissionsModalOpen(true);
    }
  }, [PermissionGroupIsSuccess]);

  console.log(updateGroupBody);

  return (
    <Row style={{ padding: 25 }} gutter={[8, 8]}>
      <Col span={24}>
        <Row style={{ width: "100%" }} gutter={[8, 8]}>
          <Col xs={{ span: 24 }} md={{ span: 5 }}>
            <Button
              size="large"
              style={{ width: "100%" }}
              type="primary"
              onClick={() => setIsFiltersOpen(true)}
              icon={<FilterOutlined />}
            >
              {t("table.filters")}
            </Button>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 19 }}>
            <FilterChips
              startDateKeyName="start_date"
              endDateKeyName="end_date"
              query={query}
              setQuery={setQuery}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row style={{ width: "100%" }} gutter={[8, 8]}>
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <Search query={query} setQuery={setQuery} searchOption="name" />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Button
              type="dashed"
              danger
              onClick={() => {
                setQuery({});
              }}
              icon={<RemoveFiltersIcon />}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("table.clear_filters")}
            </Button>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Button
              type="primary"
              onClick={() => {
                setIsCreateModalOpen(true);
              }}
              icon={<PlusOutlined />}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("buttons.create_group")}
            </Button>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
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
              onClick: (item) => {
                setCurrentItem(item);
                setUpdateGroupBody({
                  description: item.description,
                  name: item.name,
                  profile_id: item.profile_id,
                  group_id: item.id,
                });
                setIsUpdateModalOpen(true);
              },
            },
            {
              label: "permissions",
              icon: <SettingOutlined style={{ fontSize: "20px" }} />,
              onClick: (item) => {
                setCurrentItem(item);
                setIsPermissionsModalOpen(true);
              },
            },
          ]}
          data={PermissionGroupsData}
          items={PermissionGroupsData?.permission_groups}
          error={PermissionGroupsDataError}
          columns={[
            { name: "id", type: "id", sort: true },
            { name: "name", type: "text", sort: true },
            {
              name: "profile_name",
              type: "translate",
              sort: true,
            },
            {
              name: "linked_user_total",
              type: "text",
            },
            { name: "description", type: "text", sort: true },
            {
              name: "status",
              type: "status",
              sort: true,
            },
          ]}
          loading={isPermissionGroupsDataFetching}
          label={["name"]}
        />
      </Col>
      {isCreateModalOpen && (
        <MutateModal
          type="create"
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          fields={[
            { label: "name", required: true },
            { label: "profile_id", required: true },
            { label: "description", required: false },
          ]}
          body={createGroupBody}
          setBody={setCreateGroupBody}
          modalName={t("modal.create_group")}
          submit={PermissionGroupMutate}
          submitLoading={PermissionGroupIsLoading}
          error={PermissionGroupError}
          success={PermissionGroupIsSuccess}
        />
      )}
      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "name", required: true },
            { label: "profile_id", required: true },
            { label: "description", required: false },
          ]}
          body={updateGroupBody}
          setBody={setUpdateGroupBody}
          modalName={t("modal.create_group")}
          submit={UpdatePermissionGroupMutate}
          submitLoading={UpdatePermissionGroupIsLoading}
          error={UpdatePermissionGroupError}
          success={UpdatePermissionGroupIsSuccess}
        />
      )}
      {isPermissionsModalOpen && (
        <PermissionsModal
          open={isPermissionsModalOpen}
          setOpen={setIsPermissionsModalOpen}
          group={currentItem}
        />
      )}
      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={PermissionGroupError}
        success={PermissionGroupIsSuccess}
      />
    </Row>
  );
};
