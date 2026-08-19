import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { getAccessories, getBrands, getCategories } from "../Redux/Async/Asynch";
import { port } from "../../Data";
import { toast } from "react-toastify";
function UpdateItem() {
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
    accessory: "",
    color: "",
    price: 0,
    offer: false,
    discountPrice: 0,
    gender: "male",
    thumbnailImage: "",
    sizes: [],
  });

  //   const id = useParams();
  console.log(id);
  useEffect(() => {
    async function getItemData() {
      const api = await fetch(`${port}/api/item/finditem/${id}`, {
        method: "GET",
      });
      const res = await api.json();
      const normalizedSizes = Array.isArray(res.sizes)
        ? res.sizes.map((s) => ({
            size: s.size != null ? String(s.size) : "",
            stock:
              s.stock !== undefined && s.stock !== null && s.stock !== ""
                ? Number(s.stock)
                : 0,
          }))
        : [];
      setForm({
        ...res,
        sizes: normalizedSizes,
        accessory:
          res.accessoryId?.accessory ?? res.accessory ?? "",
        accessoryId: res.accessoryId?._id ?? res.accessoryId ?? undefined,
      });
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
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${port}/api/upload/single?folder=products`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, thumbnailImage: data.imageUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Thumbnail upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDataSubmit() {
    setLoading(true);
    const formData = new FormData();
    for (const i of galleryImages) {
      if (!i.name) continue;
      formData.append("images", i);
    }
    if (!formData.has("images")) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${port}/api/upload/multiple?folder=products`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, images: data.imageUrls }));
    } catch (error) {
      console.error("Error uploading gallery:", error);
      toast.error("Gallery upload failed");
    } finally {
      setLoading(false);
    }
  }
  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!form.accessoryId) {
      toast.error("Please select an accessory");
      return;
    }
    const payload = {
      ...form,
      accessoryId: form.accessoryId,
      accessory: form.accessory || "",
    };
    const api = await fetch(`${port}/api/item/updateItem/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        accessory: "",
        color: "",
        price: 0,
        offer: false,
        discountPrice: 0,
        gender: "male",
        thumbnailImage: "",
        sizes: [],
      });
    }
  };

  const thumbnailImg = useRef();
  const galleryImgs = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getAccessories());
  }, [dispatch]);
  const { categories, brands, accessories } = useSelector(
    (select) => select.Categories
  );
  const handleAutocompleteChange = (event, value, type) => {
    if (type === "category" && categories && categories.length > 0) {
      const cat = categories.find((item) => item.category === value);
      setForm({ ...form, category: cat.category, categoryId: cat._id });
    } else if (type === "brand" && brands && brands.length > 0) {
      const b = brands.find((item) => item.brand === value);
      setForm({ ...form, brand: b.brand, brandId: b._id });
    } else if (type === "accessory" && accessories && accessories.length > 0) {
      const a = accessories.find((item) => item.accessory === value);
      if (a) {
        setForm({ ...form, accessory: a.accessory, accessoryId: a._id });
      }
    }
  };

  const handleAddSize = () => {
    setForm({
      ...form,
      sizes: [...(form.sizes || []), { size: "", stock: 0 }],
    });
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = (form.sizes || []).filter((_, i) => i !== index);
    setForm({ ...form, sizes: updatedSizes });
  };

  const handleSizeChange = (index, field, value) => {
    const list = form.sizes || [];
    const updatedSizes = list.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === "stock" ? (value !== "" ? parseInt(value, 10) : 0) : value,
        };
      }
      return item;
    });
    setForm({ ...form, sizes: updatedSizes });
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
        <h2 className="capitalize font-semibold text-xl">edit product</h2>
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
        <div className="flex w-full flex-wrap items-center justify-between gap-3 my-4">
          <Stack className="grow min-w-[200px]">
            <label
              htmlFor=""
              className="block text-sm capitalize font-semibold my-2"
            >
              Category*
            </label>
            <Autocomplete
              freeSolo
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
          <Stack className="grow min-w-[200px]">
            <label
              htmlFor=""
              className="block text-sm capitalize font-semibold my-2"
            >
              brand*
            </label>
            <Autocomplete
              freeSolo
              disableClearable
              value={form.brand}
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
          <Stack className="grow min-w-[200px]">
            <label className="block text-sm capitalize font-semibold my-2">
              accessory*
            </label>
            <Autocomplete
              disableClearable
              options={
                accessories?.length > 0
                  ? accessories.map((o) => o.accessory)
                  : []
              }
              value={form.accessory || null}
              onChange={(e, value) =>
                handleAutocompleteChange(e, value, "accessory")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select accessory"
                  placeholder="Choose from list"
                />
              )}
            />
          </Stack>
        </div>
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

          {(form.sizes || []).map((sizeItem, index) => (
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

          {(!form.sizes || form.sizes.length === 0) && (
            <p className="text-gray-500 text-sm italic">
              No sizes added yet. Click &quot;Add Size&quot; to add size and stock
              information.
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
              className="bg-white flex items-center justify-center text-deepRed-300 p-1 h-5 w-5 rounded-full absolute top-0 right-0"
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
                  className="bg-white flex items-center justify-center text-deepRed-300 p-1 h-5 w-5 rounded-full absolute top-0 right-0"
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
