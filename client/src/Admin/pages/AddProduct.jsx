import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
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
import { MdClose, MdDelete } from "react-icons/md";
import { getAccessories, getBrands, getCategories } from "../Redux/Async/Asynch";
import { port } from "../../Data";
import { toast } from "react-toastify";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState(null);
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

  useEffect(() => {
    if (!file) {
      setThumbnailPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!galleryFiles.length) {
      setGalleryPreviews([]);
      return;
    }
    const urls = galleryFiles.map((f) => URL.createObjectURL(f));
    setGalleryPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [galleryFiles]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc]);

  const removeThumbnail = () => {
    setFile(null);
    if (thumbnailImg.current) thumbnailImg.current.value = "";
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a thumbnail image");
      return;
    }
    if (galleryFiles.length === 0) {
      toast.error("Please select at least one gallery image");
      return;
    }
    if (!form.accessoryId) {
      toast.error("Please select an accessory");
      return;
    }

    setLoading(true);
    try {
      const thumbFd = new FormData();
      thumbFd.append("image", file);
      const thumbRes = await fetch(`${port}/api/upload/single`, {
        method: "POST",
        body: thumbFd,
      });
      const thumbData = await thumbRes.json();
      if (!thumbRes.ok) {
        throw new Error(thumbData.message || "Thumbnail upload failed");
      }

      const galFd = new FormData();
      galleryFiles.forEach((f) => galFd.append("images", f));
      const galRes = await fetch(`${port}/api/upload/multiple`, {
        method: "POST",
        body: galFd,
      });
      const galData = await galRes.json();
      if (!galRes.ok) {
        throw new Error(galData.message || "Gallery upload failed");
      }

      const payload = {
        ...form,
        thumbnailImage: thumbData.imageUrl,
        images: galData.imageUrls,
      };

      const api = await fetch(`${port}/api/item/listItem`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        method: "POST",
      });
      const res = await api.json();
      toast.warn(res.warn);
      toast.success(res.msg);
      if (api.ok) {
        setFile(null);
        setGalleryFiles([]);
        if (thumbnailImg.current) thumbnailImg.current.value = "";
        if (galleryImgs.current) galleryImgs.current.value = "";
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
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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

      <form
        onSubmit={handleSubmit}
        className="w-1/2 mx-auto bg-white p-4 my-8"
      >
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
                  label="Select category"
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
                  label="Select brand"
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
                  placeholder="select accessory"
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
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFile(f || null);
            }}
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
          {thumbnailPreview && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">Preview</p>
              <div className="relative inline-block max-w-full">
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow hover:bg-slate-50"
                  aria-label="Remove thumbnail"
                >
                  <MdClose size={18} />
                </button>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxSrc(thumbnailPreview)}
                  onKeyDown={(ev) =>
                    ev.key === "Enter" && setLightboxSrc(thumbnailPreview)
                  }
                  className="max-h-52 max-w-full cursor-zoom-in rounded-md border border-slate-200 object-contain bg-slate-50"
                />
              </div>
            </div>
          )}
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
            accept="image/*"
            multiple
            onChange={(e) => {
              const picked = Array.from(e.target.files || []);
              if (picked.length === 0) return;
              setGalleryFiles((prev) => {
                const next = [...prev, ...picked].slice(0, 6);
                if (prev.length + picked.length > 6) {
                  toast.info("Maximum 6 gallery images");
                }
                return next;
              });
              e.target.value = "";
            }}
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
          {galleryPreviews.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Preview</p>
              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((src, i) => (
                  <div
                    key={`${galleryFiles[i]?.name}-${i}`}
                    className="relative h-28 w-28 shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow hover:bg-slate-50"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <MdClose size={18} />
                    </button>
                    <img
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxSrc(src)}
                      onKeyDown={(ev) =>
                        ev.key === "Enter" && setLightboxSrc(src)
                      }
                      className="h-full w-full cursor-zoom-in rounded-md border border-slate-200 object-cover bg-slate-50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="w-full bg-black disabled:opacity-50 disabled:cursor-wait text-white py-2 rounded-md uppercase my-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving…" : "create list"}
        </button>
      </form>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          onClick={() => setLightboxSrc(null)}
          role="presentation"
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSrc(null);
            }}
            aria-label="Close preview"
          >
            ×
          </button>
          <img
            src={lightboxSrc}
            alt=""
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default AddProduct;