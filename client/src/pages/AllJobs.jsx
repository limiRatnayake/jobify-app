import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";
import { useQuery } from "@tanstack/react-query";

const allJobsQuery = (params) => {
  const { search, jobType, jobStatus, sort, page } = params;
  return {
    queryKey: [
      "jobs",
      search ?? "",
      jobStatus ?? "all",
      jobType ?? "all",
      sort ?? "newest",
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get("/jobs", {
        params,
      });
      return data;
    },
  };
};

export const allJobLoader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    const data = await queryClient.ensureQueryData(allJobsQuery(params));
    return { searchValues: { ...params } };
    // try {
    //   const { data } = await customFetch.get("/jobs", {
    //     params,
    //   });
    //   return { data, searchValues: { ...params } };
    // } catch (error) {
    //   console.log(error);
    //   toast.error(error?.response?.data?.msg);
    //   return error;
    // }
  };
// You can also use props to pass data to components bt context is latest one
const AllJobContext = createContext();
const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));

  return (
    <AllJobContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobContext);
export default AllJobs;
