import { Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { port } from "../../Data";
import { useNavigate } from "react-router";
import { setCredentials } from "../Redux/Slices/authSlice";
import logo from "../../assets/logo2.png";

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
    const res = await request.json();
    console.log(res);
    if (res.user?.admin) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("admin", String(Boolean(res.user.admin)));
      localStorage.setItem("user", JSON.stringify(res.user));
      dispatch(setCredentials({ user: res.user, token: res.token }));
      navigate("/admin");
    }
    return res;
  };

  return (
    <div className="bg-slate-100 flex items-center justify-center min-h-screen">
      <form action="" className="bg-white p-8 w-1/3 rounded-sm ">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Bata" className="h-[4rem] w-auto" />
        </div>
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
