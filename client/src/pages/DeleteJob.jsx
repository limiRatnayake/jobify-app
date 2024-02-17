import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const deleteJobLoader = async ({ params }) => {
  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success("Job deleted successfully");
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg);
  }
  return redirect("/dashboard/all-jobs");
};

