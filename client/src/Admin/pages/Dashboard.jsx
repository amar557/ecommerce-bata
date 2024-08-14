import { FaArrowTrendUp } from "react-icons/fa6";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import Chart from "../components/Chart";
import { FaRegStar } from "react-icons/fa6";
import { FaShopLock } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const salesData = [
  { category: "Electronics", sale: 0 },
  { category: "Fashion", sale: 0 },
  { category: "Home Decor", sale: 0 },
  { category: "Sports Equipment", sale: 0 },
  { category: "Beauty & Personal Care", sale: 0 },
  { category: "Baby Products", sale: 0 },
  { category: "Gaming", sale: 0 },
  { category: "Outdoor Gear", sale: 0 },
  { category: "Musical Instruments", sale: 0 },
  { category: "Arts & Crafts", sale: 0 },
];
const salesData2 = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 1 },
  { month: "Mar", sales: 2 },
  { month: "Apr", sales: 3 },
  { month: "May", sales: 4 },
  { month: "Jun", sales: 5 },
  { month: "Jul", sales: 5 },
  { month: "Aug", sales: 5 },
  { month: "Sep", sales: 5 },
  { month: "Oct", sales: 5 },
  { month: "Nov", sales: 5 },
  { month: "Dec", sales: 5 },
];
function Dashboard() {
  const [menu, setMenu] = useState(false);
  const handleMenu = function () {
    setMenu((show) => !show);
  };
  return (
    <div className=" p-8 bg-slate-200">
      <div className="flex items-center justify-between gap-8 mb-6  ">
        <div className="flex items-center justify-between  bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow">
          <div className="grow flex flex-col  items-start justify-start">
            <p className="capitalize  text-slate-500 font-medium ">orders</p>
            <p className="text-2xl font-bold  ">9</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <FaArrowTrendUp />
          </div>
        </div>
        <div className="flex items-center justify-between  bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
          <div className="grow flex flex-col  items-start justify-start">
            <p className="capitalize  text-slate-500 font-medium ">sale</p>
            <p className="text-2xl font-bold  ">$0.00</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <BsCurrencyDollar />
          </div>
        </div>
        <div className="flex items-center justify-between  bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
          <div className="grow flex flex-col  items-start justify-start">
            <p className="capitalize  text-slate-500 font-medium ">product</p>
            <p className="text-2xl font-bold  ">38</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <FaProductHunt />
          </div>
        </div>
        <div className="flex items-center justify-between  bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
          <div className="grow flex flex-col  items-start justify-start">
            <p className="capitalize  text-slate-500 font-medium ">customer</p>
            <p className="text-2xl font-bold  ">0</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <FiUsers />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-8 mb-6  ">
        <div className="flex items-center flex-col justify-between  bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow-[2]">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-bold capitalize">order statistics</p>
            <div className="">
              <div className="dropdown inline-block relative">
                <button
                  className="bg-blue-300 text-gray-700 font-semibold py-1 text-sm px-2 rounded-full inline-flex items-center"
                  onClick={handleMenu}
                >
                  <span className="mr-1">Dropdown</span>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </button>
                {menu && (
                  <ul className=" absolute  text-gray-700 pt-1">
                    <li className="">
                      <a
                        className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        this year
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        last year
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        lifetime
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between w-full py-4 px-8">
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-xl font-bold">2</p>
              <p className="text-blue-700 font-semibold"> $4454521</p>
              <p className="text-slate-400 font-semibold text-sm">pending</p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-xl font-bold">2</p>
              <p className="text-blue-700 font-semibold"> $4454521</p>
              <p className="text-slate-400 font-semibold text-sm">delivered</p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-xl font-bold">2</p>
              <p className="text-blue-700 font-semibold"> $4454521</p>
              <p className="text-slate-400 font-semibold text-sm">processing</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between  bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
          <div className="grow flex flex-col h-40 w-40 overflow-hidden  items-start justify-start">
            <Chart />
          </div>
        </div>
        <div className="flex flex-col gap-3 grow">
          <div className="flex items-center justify-between  bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
            <div className="grow flex flex-col  items-start justify-start">
              <p className="capitalize  text-slate-500 font-medium ">brands</p>
              <p className="text-2xl font-bold  ">0</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
              <FaRegStar />
            </div>
          </div>
          <div className="flex items-center justify-between  bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
            <div className="grow flex flex-col  items-start justify-start">
              <p className="capitalize  text-slate-500 font-medium ">sellers</p>
              <p className="text-2xl font-bold  ">0</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
              <FaShopLock />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-8 mb-6  ">
        <div className="flex items-center flex-col justify-between  bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow-[2]">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-bold capitalize">
              Category Product Sales Statistics
            </p>
            <div className="">
              <div className="dropdown inline-block relative">
                <button
                  className="bg-blue-300 text-gray-700 font-semibold py-1 text-sm px-2 rounded-full inline-flex items-center"
                  onClick={handleMenu}
                >
                  <span className="mr-1">Dropdown</span>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </button>
                {menu && (
                  <ul className=" absolute  text-gray-700 pt-1">
                    <li className="">
                      <a
                        className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href=""
                      >
                        this year
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        last year
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        lifetime
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="h-40 w-full">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={800}
                height={300}
                data={salesData}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="category"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="sale"
                  fill="#000000"
                  background={{ fill: "#ffffff" }}
                  barSize={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-center flex-col justify-between  bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow-[2]">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-bold capitalize">sales state</p>
            <div className="">
              <div className="dropdown inline-block relative">
                <button
                  className="bg-blue-300 text-gray-700 font-semibold py-1 text-sm px-2 rounded-full inline-flex items-center"
                  onClick={handleMenu}
                >
                  <span className="mr-1">Dropdown</span>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </button>
                {menu && (
                  <ul className=" absolute  text-gray-700 pt-1">
                    <li className="">
                      <a
                        className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href=""
                      >
                        this year
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        last year
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        lifetime
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="h-40 w-full">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={800}
                height={300}
                data={salesData2}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="month"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="sales"
                  fill="#000000"
                  background={{ fill: "#ffffff" }}
                  barSize={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start gap-3">
        <div className="w-[700px]">
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
                <p className="text-center w-20 capitalize  ">
                  Walk-In Customer
                </p>
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
        <div className="flex flex-col items-start w-1/3 bg-white justify-start ">
          <div className="bg-blue-400 text-white w-full p-4">
            <p className="text-3xl font-bold">0</p>
            <p className="first-letter:uppercase">sellers need help</p>
          </div>
          <p className="p-4">view all</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
