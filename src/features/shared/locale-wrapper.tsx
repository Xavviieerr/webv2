"use client";
import { useTranslation } from "react-i18next";

const LocaleWrapper = ({
  item,
  locale = "common",
}: {
  item: string;
  locale?: string;
}) => {
  const { t } = useTranslation(locale);

  return t(item);
};

export default LocaleWrapper;
