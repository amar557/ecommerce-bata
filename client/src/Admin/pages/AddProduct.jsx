import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Button,
  IconButton,
} from "@mui/material";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { getBrands, getCategories } from "../Redux/Async/Asynch";
import { port } from "../../Data";
import { toast } from "react-toastify";

function AddProduct() {
  const navigate = useNavigate();
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
    sizes: [],
  });

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
    const api = await fetch(`${port}/api/item/listItem`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      method: "POST",
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
        sizes: [],
      });
    }
    console.log(res);
    console.log(form);
  };

  const thumbnailImg = useRef();
  const galleryImgs = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
  }, []);

  const { categories, brands } = useSelector((select) => select.Categories);

  const handleAutocompleteChange = (event, value, type) => {
    if (type === "category" && categories && categories.length > 0) {
      const cat = categories.find((item) => item.category === value);
      setForm({ ...form, category: cat.category, categoryId: cat._id });
    } else if (type === "brand" && brands && brands.length > 0) {
      const cat = brands.find((item) => item.brand === value);
      console.log("brnads");
      setForm({ ...form, brand: cat.brand, brandId: cat._id });
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

  // Add new size/stock entry
  const handleAddSize = () => {
    setForm({
      ...form,
      sizes: [...form.sizes, { size: "", stock: 0 }],
    });
  };

  // Remove size/stock entry
  const handleRemoveSize = (index) => {
    const updatedSizes = form.sizes.filter((_, i) => i !== index);
    setForm({ ...form, sizes: updatedSizes });
  };

  // Update specific size/stock entry
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = form.sizes.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === "stock" ? (value ? parseInt(value) : 0) : value,
        };
      }
      return item;
    });
    setForm({ ...form, sizes: updatedSizes });
  };

  console.log(form);

  return (
    <div className="px-6 bg-slate-100">
      <div className="flex items-center justify-between w-full">
        <h2 className="capitalize font-semibold text-xl">add product</h2>
        <button
          className="bg-black uppercase rounded-sm text-white flex gap-1 py-2 px-4 items-center justify-center"
          onClick={() => navigate(-1)}
        >
          <GoArrowLeft />
          <span className="font-semibold text-sm">back</span>
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
              className="grow rounded-md bg-slate-50"
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

        {/* Sizes and Stock Section */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm capitalize font-semibold">
              sizes and stock:
            </label>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddSize}
              className="bg-blue-500"
            >
              Add Size
            </Button>
          </div>

          {form.sizes.map((sizeItem, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <TextField
                label="Size"
                placeholder="e.g., S, M, L, XL"
                value={sizeItem.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="bg-slate-50"
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Stock"
                type="number"
                placeholder="Stock quantity"
                value={sizeItem.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
                className="bg-slate-50"
                size="small"
                sx={{ flex: 1 }}
                inputProps={{ min: 0 }}
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveSize(index)}
                size="small"
              >
                <MdDelete size={20} />
              </IconButton>
            </div>
          ))}

          {form.sizes.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No sizes added yet. Click "Add Size" to add size and stock information.
            </p>
          )}
        </div>

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
            className="border w-1/2 box-border"
            id="color"
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
              defaultChecked={false}
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
            className="flex items-center justify-start border-blue-200 border w-max p-3 text-base transition-all gap-3 hover:bg-blue-200 hover:shadow-2xl shadow-blue-100 capitalize font-semibold my-2 cursor-pointer"
            onClick={() => thumbnailImg.current.click()}
          >
            <FiUploadCloud />
            <span>select image</span>
          </label>
        </div>
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
            className="flex items-center cursor-pointer justify-start border-blue-200 border w-max p-3 text-base transition-all gap-3 hover:bg-blue-200 hover:shadow-2xl shadow-blue-100 capitalize font-semibold my-2"
            onClick={() => galleryImgs.current.click()}
          >
            <FiUploadCloud />
            <span>select images</span>
          </label>
        </div>
        <button
          className="w-full bg-black disabled:opacity-50 disabled:cursor-wait text-white py-2 rounded-md uppercase my-2"
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

export default AddProduct;