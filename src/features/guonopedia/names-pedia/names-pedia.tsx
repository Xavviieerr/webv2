import NamesPediaContent from "./main";

const NamesPediaFeature = ({
  query,
}: {
  query: { type: string; gender: string; search: string; page: string };
}) => {
  return (
    <NamesPediaContent
      query={{
        type: query?.type ?? "all",
        gender: query?.gender ?? "all",
        search: query?.search ?? "",
        page: query?.page ?? "1",
      }}
    />
  );
};

export default NamesPediaFeature;
