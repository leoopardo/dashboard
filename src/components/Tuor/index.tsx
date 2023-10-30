/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tour, TourProps } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TuorComponentInterface {
  steps: TourProps["steps"] | [];
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

  useEffect(() => {
    const CSteps: TourProps["steps"] = [pageStep];

    if (searchFilterStepRef) {
      CSteps.push({
        title: t("wiki.search_filter"),
        description: t("wiki.search_filter_description"),
        target: () => searchFilterStepRef?.current,
      });
    }
    if (searchByNameStepRef) {
      CSteps.push({
        title: t("wiki.search_by_name"),
        description: t("wiki.search_user_by_name_description"),
        target: () => searchByNameStepRef?.current,
      });
    }
    if (removeFiltersStepRef) {
      CSteps.push({
        title: t("wiki.remove_filters"),
        description: t("wiki.remove_filters_description"),
        target: () => removeFiltersStepRef?.current,
      });
    }
    if (createRegisterStep) {
      CSteps.push(createRegisterStep);
    }

  
    if (exportCsvStep) {
      CSteps.push(exportCsvStep);
    }
    
    if (refreshStepRef) {
      console.log('tttest')
      CSteps.push({
        title: t("buttons.update"),
        description: t("wiki.update_table_button"),
        target: () => refreshStepRef?.current,
      });
    }
    setCurrentSteps([...CSteps, ...(steps as any)]);
  }, [i18n.language]);

  return (
    <Tour
      open={open}
      onClose={() => setOpen(false)}
      steps={currentSteps}
      animated
      gap={{ offset: 1, radius: 8 }}
      mask
    />
  );
};
