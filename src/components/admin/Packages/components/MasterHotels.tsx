"use client";

import { useState, useMemo, useEffect } from "react";
import { emptyMasterHotel } from "../utils/helpers";
import { cls } from "../utils/helpers";
import { OPTIONS } from "../utils/constants";
import { Card, Btn, Inp, TA, Sel, FL, Modal } from "./UI";
import { Ic } from "./Icons";
import { ImageUploader } from "./ImageUploader";
import { useDispatch, useSelector } from "react-redux";
import {
  setMasterHotels,
  addMasterHotel,
  updateMasterHotel,
  deleteMasterHotel,
} from "@/hooks/slices/packages/PackagesSlice"; // adjust path as needed
import { AppDispatch, RootState } from "@/store/store";

// ─── TYPES ────────────────────────────────────────────────────────

interface MasterHotel {
  _id: string;
  hotelName: string;
  city: string;
  starRating: string;
  description: string;
  roomTypes: string[];
  amenities: string[];
  images: string[];
}

type ModalMode = "create" | "edit";

interface ModalState {
  mode: ModalMode;
  data: MasterHotel | null;
}

interface MasterHotelFormProps {
  initial: MasterHotel | null;
  onSave: (form: MasterHotel) => void;
  onClose: () => void;
}

// ─── API HELPERS ──────────────────────────────────────────────────

interface ApiResult {
  success: boolean;
  data?: MasterHotel[];
  insertedId?: string;
}

const api = {
  fetchAll: (): Promise<ApiResult> =>
    fetch("/api/admin/hotels").then((r) => r.json()),

  create: (data: MasterHotel): Promise<ApiResult> =>
    fetch("/api/admin/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (data: MasterHotel): Promise<ApiResult> =>
    fetch("/api/admin/hotels", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id: string): Promise<ApiResult> =>
    fetch("/api/hotels", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then((r) => r.json()),
};

// ─── MASTER HOTEL FORM ────────────────────────────────────────────

export const MasterHotelForm = ({
  initial,
  onSave,
  onClose,
}: MasterHotelFormProps) => {
  const [form, setForm] = useState<MasterHotel>(initial ?? emptyMasterHotel());

  const upd = <K extends keyof MasterHotel>(field: K, value: MasterHotel[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FL required>Hotel Name</FL>
          <Inp
            placeholder="e.g. The Taj Lake Palace"
            value={form.hotelName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              upd("hotelName", e.target.value)
            }
          />
        </div>
        <div>
          <FL>City</FL>
          <Inp
            placeholder="e.g. Udaipur, Rajasthan"
            value={form.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              upd("city", e.target.value)
            }
          />
        </div>
        <div>
          <FL>Star Rating</FL>
          <div className="flex gap-2">
            {OPTIONS.starRating.map((s: string) => (
              <button
                key={s}
                type="button"
                onClick={() => upd("starRating", s)}
                className={cls(
                  "flex-1 py-2 text-sm font-bold rounded-lg border transition-all",
                  form.starRating === s
                    ? "bg-amber-400 text-white border-amber-400"
                    : "bg-white text-gray-500 border-gray-200 hover:border-amber-300",
                )}
              >
                {s}★
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <FL>Description</FL>
          <TA
            placeholder="What makes this hotel special…"
            value={form.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              upd("description", e.target.value)
            }
            rows={2}
          />
        </div>
      </div>

      <div>
        <FL>Room Types</FL>
        <Sel
          options={OPTIONS.roomType.filter(
            (r: string) => !form.roomTypes.includes(r),
          )}
          placeholder="Select room type to add"
          value=""
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            if (e.target.value)
              upd("roomTypes", [...form.roomTypes, e.target.value]);
          }}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {form.roomTypes.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200"
            >
              {r}
              <button
                onClick={() =>
                  upd(
                    "roomTypes",
                    form.roomTypes.filter((_, j) => j !== i),
                  )
                }
                className="text-emerald-400 hover:text-red-500"
              >
                <Ic.X />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <FL>Amenities</FL>
        <div className="grid grid-cols-3 gap-1.5 mt-1">
          {OPTIONS.amenities.map((a: string) => {
            const has = form.amenities.includes(a);
            return (
              <label
                key={a}
                className={cls(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all text-xs font-medium",
                  has
                    ? "bg-blue-950 text-white border-blue-950"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={has}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    upd(
                      "amenities",
                      e.target.checked
                        ? [...form.amenities, a]
                        : form.amenities.filter((x) => x !== a),
                    )
                  }
                />
                {a}
              </label>
            );
          })}
        </div>
      </div>

      <ImageUploader
        images={form.images}
        onAdd={(url: string) => upd("images", [...form.images, url])}
        onRemove={(i: number) =>
          upd(
            "images",
            form.images.filter((_, j) => j !== i),
          )
        }
      />

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Btn variant="outline" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          onClick={() => {
            if (form.hotelName.trim()) onSave(form);
          }}
        >
          Save Hotel
        </Btn>
      </div>
    </div>
  );
};

// ─── MASTER HOTELS PAGE ───────────────────────────────────────────

export const MasterHotelsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, masterHotels } = useSelector(
    (state: RootState) => state.packages,
  );

  const [modal, setModal] = useState<ModalState | null>(null);
  const [search, setSearch] = useState<string>("");

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const result = await api.fetchAll();
        if (result.success && result.data) {
          dispatch(setMasterHotels(result.data));
        }
      } catch (err) {
        console.error("FETCH HOTEL ERROR:", err);
      }
    };
    fetchHotels();
  }, [dispatch]);

  // ── Derived state ──────────────────────────────────────────────
  const filtered = masterHotels.filter(
    (h) =>
      !search ||
      h.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()),
  );

  const usageCount = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    masterHotels.forEach((h) => {
      map[h._id] = 0;
    });
    packages.forEach((pkg) =>
      pkg.itinerary.forEach((day) =>
        day.hotelStays.forEach((hs) => {
          if (hs.hotelRef && map[hs.hotelRef] !== undefined) {
            map[hs.hotelRef]++;
          }
        }),
      ),
    );
    return map;
  }, [masterHotels, packages]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleSave = async (data: MasterHotel) => {
    if (!modal) return;
    try {
      if (modal.mode === "create") {
        const result = await api.create(data);
        if (result.success && result.insertedId) {
          dispatch(addMasterHotel({ ...data, _id: result.insertedId }));
        }
      } else {
        const result = await api.update(data);
        if (result.success) {
          dispatch(updateMasterHotel(data));
        }
      }
      setModal(null);
    } catch (err) {
      console.error("HOTEL SAVE ERROR:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const count = usageCount[id] ?? 0;
    const confirmed = window.confirm(
      count > 0
        ? `Used in ${count} package(s). Continue?`
        : "Delete this hotel?",
    );
    if (!confirmed) return;
    try {
      const result = await api.delete(id);
      if (result.success) {
        dispatch(deleteMasterHotel(id));
      }
    } catch (err) {
      console.error("DELETE HOTEL ERROR:", err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Ic.Search />
          </div>
          <Inp
            className="pl-9"
            placeholder="Search hotels, cities…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <Btn onClick={() => setModal({ mode: "create", data: null })}>
          <Ic.Plus />
          New Hotel
        </Btn>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No hotels found</p>
          </div>
        )}
        {filtered.map((hotel) => {
          const usage = usageCount[hotel._id] ?? 0;
          return (
            <Card key={hotel._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Ic.Hotel />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900">
                        {hotel.hotelName}
                      </h3>
                      <div className="flex">
                        {Array.from({ length: Number(hotel.starRating) }).map(
                          (_, i) => (
                            <Ic.Star key={i} />
                          ),
                        )}
                      </div>
                      {usage > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                          <Ic.Link />
                          Used in {usage} pkg
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Ic.MapPin />
                      {hotel.city}
                    </p>
                    {hotel.description && (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.roomTypes?.map((r) => (
                        <span
                          key={r}
                          className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    {hotel.amenities?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {hotel.amenities.slice(0, 4).join(" · ")}
                        {hotel.amenities.length > 4
                          ? ` +${hotel.amenities.length - 4} more`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setModal({ mode: "edit", data: hotel })}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Ic.Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.mode === "create" ? "Create Master Hotel" : "Edit Master Hotel"
        }
        wide
      >
        <MasterHotelForm
          initial={modal?.data ?? null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      </Modal>
    </div>
  );
};
