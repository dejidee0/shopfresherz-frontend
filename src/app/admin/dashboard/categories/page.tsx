"use client";
import { Button } from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import { Toggle } from "@/components/ui/Toggle";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";

interface CategoryFormData {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  active: boolean;
  featured: boolean;
}
const AdminCategoriesPage = () => {
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    active: true,
    featured: false,
  });

  const [inEditMode, setInEditMode] = useState(false)

  const fetchedCategories = [
    {
      id: "1",
      name: "Computers & Laptop",
      itemsUnder: "3",
    },
    {
      id: "2",
      name: "SmartPhone",
      itemsUnder: "3",
    },
    {
      id: "3",
      name: "Headphone",
      itemsUnder: "7",
    },
    {
      id: "4",
      name: "Mobile Assessories",
      itemsUnder: "2",
    },
    {
      id: "5",
      name: "Gaming Console",
      itemsUnder: "8",
    },
  ];

  const set = (key: keyof CategoryFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="p-2 md:p-4 lg:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="mb-6 flex flex-col gap-3">
          <p className="font-bold">Categories Details</p>
          <p className="text-xs text-text-muted">
            {" "}
            organise your product catalogue
          </p>
        </div>

        <Button onClick={()=> setInEditMode(true)} className="text-xs md:text-sm rounded-md">Add Category</Button>
      </div>

      {/* Content */}
      <div className="flex flex-col-reverse md:flex-row gap-3 ">
        <SectionCard className="flex flex-1 flex-col gap-3 p-1 md:p-6">
          {fetchedCategories.map((cat) => (
            <div key={cat.id} className="flex w-full p-3 justify-between">
              <div className="flex gap-2">
                <button>
                  <MdDragIndicator />
                </button>
                <p className="flex text-xs md:text-sm gap-2 items-center">
                  <span className="h-8 flex justify-center items-center w-8 rounded-full p-2 bg-border">
                    {cat.name.split("").at(0)}
                  </span>
                  {cat.name}
                </p>
              </div>
              <p className="flex items-center text-xs md:text-sm text-text-muted">{cat.itemsUnder}</p>
            </div>
          ))}
        </SectionCard>
        <SectionCard className={`flex flex-1 flex-col gap-3 ${!inEditMode && "hidden"}`}>
          <p className=" font-semibold m-6 mb-0">New Category</p>
          <div className="px-6 py-5 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Product name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="Product Slug"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder="Meta Title"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="Meta Description"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Toggle
                  checked={form.active}
                  onChange={(v) => set("active", v)}
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  checked={form.featured}
                  onChange={(v) => set("featured", v)}
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured
                </span>
              </div>
            </div>

            <div className="flex gap-2">
                 <Button variant="ghost" onClick={()=>(setInEditMode(false))} className="text-xs md:text-sm rounded-md">Cancel</Button>
                <Button className="text-xs md:text-sm rounded-md">Save Category</Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
