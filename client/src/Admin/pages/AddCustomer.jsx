import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router";

function AddCustomer() {
  const navigate = useNavigate();

  return (
    <div className="px-6 bg-slate-100">
      <div className="flex items-center justify-between w-full">
        <h2 className="capitalize font-semibold text-xl">add product</h2>
        <button
          className="bg-black uppercase  rounded-sm text-white flex gap-1  py-2 px-4 items-center justify-center"
          onClick={() => navigate(-1)}
        >
          <GoArrowLeft />
          <span className="font-semibold text-sm  ">back</span>
        </button>
      </div>
      <form action="" className="bg-white w-3/5 mx-auto p-4 rounded-md">
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          first Name*
        </label>
        <input
          type="text"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="first name"
          id=""
        />
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          last Name*
        </label>
        <input
          type="text"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="last name"
          id=""
        />
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          phone*
        </label>
        <input
          type="number"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="phone"
          id=""
        />
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          email*
        </label>
        <input
          type="email"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="email"
          id=""
        />
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          password*
        </label>
        <input
          type="password"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="password"
          id=""
        />
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          confirm password*
        </label>
        <input
          type="password"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="confirm password"
          id=""
        />
      </form>
    </div>
  );
}

export default AddCustomer;
