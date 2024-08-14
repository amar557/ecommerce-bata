import { IoEyeOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";

function Orders() {
  return (
    <div className="bg-slate-200 px-6">
      <div>
        <h1 className=" capitalize text-xl font-semibold  ">all orders</h1>
        <h1 className="first-letter:uppercase">you have 10 orders</h1>
      </div>
      <div className="w-full my-5">
        <div className="flex items-center flex-col justify-between bg-white rounded-sm shadow-slate-300 shadow-md  py-4 grow-[2]">
          <div className="flex items-center justify-between w-full mb-4 px-6">
            <p className="font-semibold text-sm">invoices</p>
            <button className="bg-black text-white px-3 uppercase text-sm font-semibold py-1 rounded-3xl">
              view more
            </button>
          </div>
          <div className="flex gap-3 w-full overflow-x-auto flex-col px-2">
            <div className="flex min-w-max gap-4 bg-slate-100 py-2 px-4 items-center  justify-between">
              <p className="text-center w-20 capitalize font-semibold ">#</p>
              <p className="text-center w-20 capitalize font-semibold ">
                order code
              </p>
              <p className="text-center w-20 capitalize font-semibold ">
                customer
              </p>
              <p className="text-center w-20 capitalize font-semibold ">
                total product
              </p>
              <p className="text-center w-20 capitalize font-semibold ">
                total amount
              </p>
              <p className="text-center w-20 capitalize font-semibold ">
                delivery status
              </p>
              <p className="text-center w-20 capitalize font-semibold ">
                payment status
              </p>
              <p className="text-center w-20 capitalize font-semibold ">
                options
              </p>
            </div>

            <div className="flex min-w-max gap-4 white items-center  justify-between">
              <p className="text-center w-20  ">1</p>
              <p className="text-center w-20 capitalize ">YR-7831270423</p>
              <p className="text-center w-20 capitalize  ">Walk-In Customer</p>
              <p className="text-center w-20 capitalize font-semibold ">1</p>
              <p className="text-center w-20 capitalize ">$900.00</p>
              <p className="text-sm py-1 px-2 box-content text-center bg-orange-200 text-orange-500 rounded-2xl  w-20 capitalize font-semibold ">
                pending
              </p>
              <p className="text-sm py-1 px-2 box-content text-center bg-orange-200 text-orange-500 rounded-2xl  w-20 capitalize font-semibold ">
                unpaid
              </p>
              <p className="text-center w-20 capitalize font-semibold  flex flex-col gap-1 items-center justify-center">
                <button className="bg-blue-100 text-black hover:bg-blue-400 hover:text-white w-8 h-8 rounded-full grid place-items-center">
                  <IoEyeOutline />
                </button>
                <button className="bg-black text-white  w-8 h-8 rounded-full grid place-items-center">
                  <LuDownload />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
