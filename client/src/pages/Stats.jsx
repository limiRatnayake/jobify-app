import { useQuery } from "@tanstack/react-query";
import { ChartsContainer, StatsContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";

const statsQuery = {
  queryKey: ["stats"],
  queryFn: async () => {
    const response = await customFetch.get("/jobs/stats");
    return response.data;
  },
};
// after adding react query
export const statsLoader = (queryClient) => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  // here you can return data and useLoaderData to get the values. but when you do it you miss useQuery other functionalities.
  // we can return null because in the component from the ueQuery we can access that
  return null;
};

// before adding react query
// export const statsLoader = async () => {
//   const response = await customFetch.get("/jobs/stats");
//   return response.data;
// };

const Stats = () => {
  // const { defaultStats, monthlyApplications } = useLoaderData();

  const {  data } = useQuery(statsQuery);
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};
export default Stats;
