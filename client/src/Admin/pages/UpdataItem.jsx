import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { RxCross2 } from "react-icons/rx";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FiUploadCloud } from "react-icons/fi";
import { getBrands, getCategories } from "../Redux/Async/Asynch";
import { port, sizes } from "../../Data";
import { toast } from "react-toastify";
function UpdateItem() {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [galleryImages, setGalleryImages] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    color: "",
    price: 0,
    offer: false,
    discountPrice: 0,
    gender: "male",
    thumbnailImage: "",
  });

  //   const id = useParams();
  console.log(id);
  useEffect(() => {
    async function getItemData() {
      const api = await fetch(`${port}/api/item/finditem/${id}`, {
        method: "GET",
      });
      const res = await api.json();
      setForm(res);
    }
    getItemData();
  }, [id]);

  useEffect(() => {
    if (galleryImages) {
      handleDataSubmit();
    }
  }, [galleryImages]);
  useEffect(() => {
    if (file) {
      handleThumbnailImage();
    }
  }, [file]);
  async function handleThumbnailImage() {
    setLoading(true);
    const mainref = ref(storage, `thumbnail/${file.name + Date.now()}`);
    try {
      const uploadTask = await uploadBytes(mainref, file);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      setForm({ ...form, thumbnailImage: downloadUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDataSubmit(e) {
    setLoading(true);
    let urls = [];
    for (let i of galleryImages) {
      if (!i.name) return;
      const mainref = ref(storage, `imges/${i.name + Date.now()}`);
      try {
        console.log("askj");
        const uploadTask = await uploadBytes(mainref, i);
        const downloadUrl = await getDownloadURL(uploadTask.ref);
        urls.push(downloadUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
    setForm({ ...form, images: urls });
    console.log(form);
    urls = [];
    setLoading(false);
  }
  const handleSubmit = async function (e) {
    e.preventDefault();
    const api = await fetch(`${port}/api/item/updateItem/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      method: "PUT",
    });
    const res = await api.json();
    toast.warn(res.warn);
    toast.success(res.msg);
    if (api.ok) {
      setForm({
        title: "",
        description: "",
        category: "",
        brand: "",
        color: "",
        price: 0,
        offer: false,
        discountPrice: 0,
        gender: "male",
        thumbnailImage: "",
      });
    }
  };
  console.log(form);

  const thumbnailImg = useRef();
  const galleryImgs = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
  }, []);
  const { categories, brands } = useSelector((select) => select.Categories);
  console.log(form.sizes);
  const handleAutocompleteChange = (event, value, type) => {
    if (type === "category" && categories && categories.length > 0) {
      const cat = categories.find((item) => item.category === value);
      setForm({ ...form, category: cat.category, categoryId: cat._id });
    } else if (type === "brand" && brands && brands.length > 0) {
      const cat = brands.find((item) => item.brand === value);
      console.log("brnads");
      setForm({ ...form, brand: cat.brand, brandId: cat._id });
    } else if (type === "sizes") {
      setForm({ ...form, sizes: value });
    }
  };

  const handleChange = (event) => {
    const { type, name, value, checked } = event.target;

    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value ? parseFloat(value) : 0;
    } else {
      newValue = value;
    }

    setForm({
      ...form,
      [name]: newValue,
    });
  };

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

      <form action="" className="w-1/2 mx-auto bg-white p-4 my-8">
        <h1 className="text-xl font-semibold border-b py-4 capitalize">
          product information
        </h1>
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          Product Name*
        </label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={form.title}
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          placeholder="product name"
          id="title"
        />
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          description
        </label>
        <textarea
          name="description"
          id="description"
          value={form.description}
          placeholder="product description "
          rows={4}
          onChange={handleChange}
          className="p-2 border rounded-md bg-slate-50 placeholder:capitalize block w-full outline-none "
        ></textarea>
        <div className="flex w-full items-center justify-between gap-3 my-4">
          <Stack className="grow">
            <label
              htmlFor=""
              className="block text-sm capitalize font-semibold my-2"
            >
              Category*
            </label>
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              value={form.category}
              className="grow rounded-md bg-slate-50"
              options={
                categories && categories.length > 0
                  ? categories.map((option) => option.category)
                  : []
              }
              onChange={(e, value) =>
                handleAutocompleteChange(e, value, "category")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          </Stack>
          <Stack className="grow">
            <label
              htmlFor=""
              className="block text-sm capitalize font-semibold my-2"
            >
              brand*
            </label>
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              value={form.brand}
              className="grow   rounded-md bg-slate-50"
              options={
                brands &&
                brands.length > 0 &&
                brands.map((option) => option.brand)
              }
              onChange={(e, value) =>
                handleAutocompleteChange(e, value, "brand")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  value={form.brand}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          </Stack>
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-sm capitalize font-semibold my-2"
          >
            check the sizes that are available:
          </label>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            className="my-2"
            options={sizes}
            value={form.sizes} // The selected sizes are shown here
            onChange={(e, value) => handleAutocompleteChange(e, value, "sizes")}
            disableCloseOnSelect
            getOptionLabel={(option) => option.title}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </li>
              );
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sizes"
                placeholder="Select size(s)"
              />
            )}
          />
        </div>
        {form.sizes && form.sizes.length > 0 && (
          <div className="selected-sizes mt-4">
            <h4 className="capitalize font-medium text-sm">available Sizes:</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {form.sizes.map((size, index) => (
                <Chip key={index} label={size.title} color="primary" />
              ))}
            </div>
          </div>
        )}
        <div>
          <label
            htmlFor=""
            className="block text-sm capitalize font-semibold my-2"
            name="color"
          >
            color
          </label>
          <input
            type="color"
            value={form.color}
            className=" border w-1/2 box-border"
            id=" color"
            name="color"
            onChange={handleChange}
          />
        </div>

        <FormControlLabel
          label="offer"
          control={
            <Checkbox
              onChange={handleChange}
              name="offer"
              defaultChecked={form.offer}
              checked={form.offer}
            />
          }
        />

        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          gender
        </label>
        <Box sx={{ minWidth: 120, marginY: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              className="bg-slate-50"
              id="demo-simple-select"
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <MenuItem value={"male"}>Male</MenuItem>
              <MenuItem value={"female"}>Female</MenuItem>
              <MenuItem value={"kids"}>kids</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <div>
          <label
            htmlFor=""
            className="block text-sm capitalize font-semibold my-2"
          >
            price*
          </label>
          <input
            type="number"
            name="price"
            onChange={handleChange}
            value={form.price}
            className="block appearance-none p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
            placeholder="price"
            id=""
          />
          {form.offer && (
            <>
              <label
                htmlFor=""
                className="block text-sm capitalize font-semibold my-2"
              >
                discount price
              </label>
              <input
                type="number"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
                placeholder="discount price should be less than original price"
                id=""
              />
            </>
          )}
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-sm capitalize font-semibold my-2"
          >
            select thumbnail image: *
          </label>
          <input
            type="file"
            name=""
            id=""
            onChange={(e) => setFile(e.target.files[0])}
            ref={thumbnailImg}
            hidden
          />
          <label
            htmlFor=""
            className="flex items-center justify-start border-blue-200 border w-max p-3 text-base transition-all gap-3  hover:bg-blue-200 hover:shadow-2xl shadow-blue-100 capitalize font-semibold my-2 cursor-pointer "
            onClick={() => thumbnailImg.current.click()}
          >
            <FiUploadCloud />
            <span>select image</span>
          </label>
        </div>
        {form.thumbnailImage && (
          <div className="relative h-20 w-20">
            <img src={form.thumbnailImage} className="w-full h-auto" alt="" />
            <button
              className="bg-white flex items-center justify-center text-red-300 p-1 h-5 w-5 rounded-full absolute top-0 right-0"
              onClick={(e) => {
                e.preventDefault();
                setForm({ ...form, thumbnailImage: "" });
              }}
            >
              <RxCross2 />
            </button>
          </div>
        )}
        <div>
          <label
            htmlFor=""
            className="block text-sm capitalize font-semibold my-2"
          >
            select gallery images: (max: 6 images) *
          </label>
          <input
            type="file"
            name=""
            id=""
            multiple
            onChange={(e) => setGalleryImages(e.target.files)}
            ref={galleryImgs}
            hidden
          />
          <label
            htmlFor=""
            className="flex items-center cursor-pointer justify-start border-blue-200 border w-max p-3 text-base transition-all gap-3  hover:bg-blue-200 hover:shadow-2xl shadow-blue-100 capitalize font-semibold my-2 "
            onClick={() => galleryImgs.current.click()}
          >
            <FiUploadCloud />
            <span>select images</span>
          </label>
        </div>
        <div className="flex items-center justify-start gap-4 ">
          {form.images &&
            form.images.length > 0 &&
            form.images.map((img, ind) => (
              <div className="relative h-auto w-20">
                <img src={img} className="w-full h-auto" alt="" />
                <button
                  className="bg-white flex items-center justify-center text-red-300 p-1 h-5 w-5 rounded-full absolute top-0 right-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm({
                      ...form,
                      images: form.images.filter((pic, i) => i !== ind),
                    });
                  }}
                >
                  <RxCross2 />
                </button>
              </div>
            ))}
        </div>
        <button
          className="w-full bg-black disabled:opacity-50  disabled:cursor-wait text-white py-2 rounded-md uppercase my-2"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          create list
        </button>
      </form>
    </div>
  );
}

export default UpdateItem;
