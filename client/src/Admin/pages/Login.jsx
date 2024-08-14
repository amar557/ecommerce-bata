import { Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { userData } from "../Redux/User.async";
import { port } from "../Data";
import { useNavigate } from "react-router";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFormChanges = function (e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    const request = await fetch(`${port}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const navigate=
    if (request.ok) {
      // navi;
    }
    const res = await request.json();
    console.log(res);
    if (res.admin) {
      navigate("/admin");
    } else return;
    localStorage.setItem("token", res.token);
    localStorage.setItem("admin", res.admin);
    return res;
  };

  // useEffect(() => {
  //   async function getUserData() {
  //     const request = await fetch(`${port}/api/auth/user/data`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: token,
  //       },
  //     });

  //     const res = await request.json();
  //     if (res.user.admin) {
  //       navigate("/admin");
  //     } else {
  //       navigate("/");
  //     }
  //     // localStorage.setItem("token", res.token);
  //     return res;
  //   }
  //   getUserData();
  // }, [token]);

  return (
    <div className="bg-slate-100 flex items-center justify-center min-h-screen">
      <form action="" className="bg-white p-8 w-1/3 rounded-sm ">
        <h1 className="capitalize text-lg font-semibold border-b pb-2">
          login
        </h1>
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          Email*
        </label>
        <input
          type="email"
          name="email"
          onChange={handleFormChanges}
          value={form.email}
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
          name="password"
          onChange={handleFormChanges}
          value={form.password}
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="password"
          id=""
        />
        <FormControlLabel
          control={<Checkbox />}
          label="remember me"
          className="capitalize my-2"
        />
        <button
          className="uppercase w-full bg-black py-2 text-white rounded-md "
          onClick={handleSubmit}
        >
          login
        </button>
      </form>
    </div>
  );
}

export default Login;
