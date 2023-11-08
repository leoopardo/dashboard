/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tour, TourProps } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

interface TuorComponentInterface {
  steps: TourProps["steps"] | [] | any[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pageStep: { title: string; description: any };
  searchFilterStepRef?: any;
  searchByNameStepRef?: any;
  removeFiltersStepRef?: any;
  createRegisterStep?: any;
  refreshStepRef?: any;
  exportCsvStep?: any;
}

export const TuorComponent = ({
  open,
  setOpen,
  steps,
  pageStep,
  exportCsvStep,
  createRegisterStep,
  searchFilterStepRef,
  searchByNameStepRef,
  refreshStepRef,
  removeFiltersStepRef,
}: TuorComponentInterface) => {
  const { t, i18n } = useTranslation();
  const [currentSteps, setCurrentSteps] = useState<TourProps["steps"]>([
    pageStep,
  ]);
  const isMobile = useMediaQuery({ maxWidth: "750px" });

  useEffect(() => {
    const CSteps: TourProps["steps"] = [
      { ...pageStep, style: { width: isMobile ? "90%" : undefined } },
    ];

    if (searchFilterStepRef) {
      CSteps.push({
        title: t("wiki.search_filter"),
        description: t("wiki.search_filter_description"),
        target: () => searchFilterStepRef?.current,
        style: { width: isMobile ? "90%" : undefined },
      });
    }
    if (searchByNameStepRef) {
      CSteps.push({
        title: t("wiki.search_by_name"),
        description: t("wiki.search_user_by_name_description"),
        target: () => searchByNameStepRef?.current,
        style: { width: isMobile ? "90%" : undefined },
      });
    }
    if (removeFiltersStepRef) {
      CSteps.push({
        title: t("wiki.remove_filters"),
        description: t("wiki.remove_filters_description"),
        target: () => removeFiltersStepRef?.current,
        style: { width: isMobile ? "90%" : undefined },
      });
    }
    if (createRegisterStep) {
      CSteps.push({
        ...createRegisterStep,
        style: { width: isMobile ? "90%" : undefined },
      });
    }

    if (exportCsvStep) {
      CSteps.push({
        ...exportCsvStep,
        style: { width: isMobile ? "90%" : undefined },
      });
    }

    if (refreshStepRef) {
      console.log("tttest");
      CSteps.push({
        title: t("buttons.update"),
        description: t("wiki.update_table_button"),
        target: () => refreshStepRef?.current,
      });
    }
    setCurrentSteps([
      ...CSteps,
      ...(
        steps?.filter((step) => {
          if (step) {
            return step;
          }
        }) as any
      ).map((step: any) => {
        return { ...step, style: { width: isMobile ? "90%" : undefined } };
      }),
    ]);
  }, [i18n.language, isMobile]);

  return (
    <div style={{ width: "300px" }}>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={currentSteps}
        animated
        gap={{ offset: 1, radius: 8 }}
        mask
        scrollIntoViewOptions
      />
    </div>
  );
};
