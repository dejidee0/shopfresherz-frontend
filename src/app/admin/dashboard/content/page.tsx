"use client"
import AddContentModal from "@/components/admin/AddContentModal";
import { Button } from "@/components/ui/Button";
import { useState, useMemo } from "react";
import { LuImage, LuPencil } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { useBanners } from "@/lib/hooks/useAdmin";

const AdminContentPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data: banners, isLoading } = useBanners();

    const contentData = useMemo(() => {
      if (!banners) return [];
      return banners.map(banner => ({
        id: banner.id,
        title: banner.title || 'Untitled',
        cta: banner.ctaText || 'Learn More',
        imgUrl: banner.imageUrl,
        live: banner.isActive || false,
      }));
    }, [banners]);

  return (
    <div className="flex flex-col p-2 md:p-4 lg:p-6 gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-start md:items-center">
            <p className="text-sm text-text-muted">Manage Homepage Banners and Content</p>
            <Button onClick={()=> setIsModalOpen(true)} className="text-xs md:text-sm rounded-md cursor-pointer">Add Banner</Button>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading banners...</div>
        ) : contentData.length === 0 ? (
          <div className="col-span-full text-center py-8">No banners found</div>
        ) : (
          contentData.map((content) => (
          <div key={content.id} className="flex flex-col md:w-[90%] lg:w-full rounded-md bg-white">
            {content.imgUrl ? (
              <img
                src={content.imgUrl}
                alt="content-image"
                className="object-cover h-[50%]"
              ></img>
            ) : (
              <div className="flex items-center justify-center h-30 rounded-t-md bg-border">
                <LuImage className="text-text-muted text-2xl" />
              </div>
            )}

            <div className="flex flex-col gap-3 p-2">
              <p className="font-semibold">{content.title}</p>
              <p className="text-text-muted text-sm">CTA: {content.cta}</p>
              <div className="flex gap-3">
                <button className="cursor-pointer">
                  <LuPencil />
                </button>

                <button className="cursor-pointer">
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {
        isModalOpen && <AddContentModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
      }
    </div>
  );
};

export default AdminContentPage;
