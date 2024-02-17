import { FormRow, FormRowSelect, SubmitBtn } from ".";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, useSubmit, Link } from "react-router-dom";
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from "../../../utils/constants";
import { useAllJobsContext } from "../pages/AllJobs";

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  const submit = useSubmit();

const debounce = (onChange) => {
  let timeout;
  return (e) => {
    const form = e.currentTarget.form;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onChange(form);
    }, 1000);
  };
};
  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">Search Form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            onChange={
              debounce((form) => {
                submit(form);
              })
            }
          />

          <FormRowSelect
            labelText="job status"
            defaultValue={jobStatus}
            name={"jobStatus"}
            list={["all", ...Object.values(JOB_STATUS)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            defaultValue={jobType}
            name={"jobType"}
            list={["all", ...Object.values(JOB_TYPE)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name="sort"
            defaultValue={sort}
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          {/* get request automaticaly bind the query params to the url. so once we reset it it will call all jobs */}
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Value
          </Link>
          {/* <SubmitBtn formBtn /> */}
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;
