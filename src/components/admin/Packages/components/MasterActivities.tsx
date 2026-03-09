"use client";

import { useState, useMemo, useEffect } from "react";
import { emptyMasterActivity } from "../utils/helpers";
import { cls } from "../utils/helpers";
import { OPTIONS, ACT_BADGE } from "../utils/constants";
import { Card, Btn, Inp, TA, Sel, FL, Modal, Badge } from "./UI";
import { Ic } from "./Icons";
import { ImageUploader } from "./ImageUploader";
import { useDispatch, useSelector } from "react-redux";
import {
  setMasterActivities,
  deleteMasterActivity,
  addMasterActivity,
  updateMasterActivity,
} from "@/hooks/slices/packages/PackagesSlice"; // adjust path as needed
import { AppDispatch, RootState } from "@/store/store";

// ─── TYPES ────────────────────────────────────────────────────────

interface MasterActivity {
  _id: string;
  title: string;
  description: string;
  activityType: string;
  defaultDuration: string;
  location: string;
  tags: string[];
  images: string[];
}

type ModalMode = "create" | "edit";

interface ModalState {
  mode: ModalMode;
  data: MasterActivity | null;
}

interface MasterActivityFormProps {
  initial: MasterActivity | null;
  onSave: (form: MasterActivity) => void;
  onClose: () => void;
}

// ─── MASTER ACTIVITY FORM ─────────────────────────────────────────

export const MasterActivityForm = ({
  initial,
  onSave,
  onClose,
}: MasterActivityFormProps) => {
  const [form, setForm] = useState<MasterActivity>(
    initial ?? emptyMasterActivity(),
  );
  const [tagIn, setTagIn] = useState<string>("");

  const upd = <K extends keyof MasterActivity>(
    field: K,
    value: MasterActivity[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FL required>Activity Title</FL>
          <Inp
            placeholder="e.g. Amber Fort Guided Tour"
            value={form.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              upd("title", e.target.value)
            }
          />
        </div>
        <div>
          <FL>Activity Type</FL>
          <Sel
            options={OPTIONS.activityType}
            value={form.activityType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              upd("activityType", e.target.value)
            }
          />
        </div>
        <div>
          <FL>Default Duration</FL>
          <Inp
            placeholder="e.g. 2 hrs"
            value={form.defaultDuration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              upd("defaultDuration", e.target.value)
            }
          />
        </div>
        <div className="col-span-2">
          <FL>Location</FL>
          <Inp
            placeholder="e.g. Jaipur, Rajasthan"
            value={form.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              upd("location", e.target.value)
            }
          />
        </div>
        <div className="col-span-2">
          <FL>Description</FL>
          <TA
            placeholder="Full description…"
            value={form.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              upd("description", e.target.value)
            }
            rows={3}
          />
        </div>
      </div>

      <div>
        <FL optional>Tags</FL>
        <div className="flex gap-2 mb-2">
          <Inp
            placeholder="e.g. Heritage"
            value={tagIn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTagIn(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && tagIn.trim()) {
                e.preventDefault();
                upd("tags", [...form.tags, tagIn.trim()]);
                setTagIn("");
              }
            }}
          />
          <Btn
            variant="outline"
            size="sm"
            onClick={() => {
              if (tagIn.trim()) {
                upd("tags", [...form.tags, tagIn.trim()]);
                setTagIn("");
              }
            }}
          >
            Add
          </Btn>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-200"
            >
              <Ic.Tag />
              {tag}
              <button
                onClick={() =>
                  upd(
                    "tags",
                    form.tags.filter((_, j) => j !== i),
                  )
                }
                className="text-blue-400 hover:text-red-500 ml-0.5"
              >
                <Ic.X />
              </button>
            </span>
          ))}
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
            if (form.title.trim()) onSave(form);
          }}
        >
          Save Activity
        </Btn>
      </div>
    </div>
  );
};

// ─── CONSTANTS ────────────────────────────────────────────────────

const typeCls: Record<string, string> = {
  meal: "text-amber-700 bg-amber-50 border-amber-200",
  sightseeing: "text-blue-700 bg-blue-50 border-blue-200",
  adventure: "text-emerald-700 bg-emerald-50 border-emerald-200",
  transfer: "text-orange-700 bg-orange-50 border-orange-200",
  leisure: "text-violet-700 bg-violet-50 border-violet-200",
  wellness: "text-pink-700 bg-pink-50 border-pink-200",
  shopping: "text-rose-700 bg-rose-50 border-rose-200",
};

// ─── API HELPERS ──────────────────────────────────────────────────

interface ApiResult {
  success: boolean;
  data?: MasterActivity[];
  insertedId?: string;
}

const api = {
  fetchAll: (): Promise<ApiResult> =>
    fetch("/api/admin/activities").then((r) => r.json()),

  create: (data: MasterActivity): Promise<ApiResult> =>
    fetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (data: MasterActivity): Promise<ApiResult> =>
    fetch("/api/admin/activities", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id: string): Promise<ApiResult> =>
    fetch(`/api/activities?id=${id}`, { method: "DELETE" }).then((r) =>
      r.json(),
    ),
};

// ─── MASTER ACTIVITIES PAGE ───────────────────────────────────────

export const MasterActivitiesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, masterActivities } = useSelector(
    (state: RootState) => state.packages,
  );

  const [modal, setModal] = useState<ModalState | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    const fetchActivities = async () => {
      const result = await api.fetchAll();
      if (result.success && result.data) {
        dispatch(setMasterActivities(result.data));
      }
    };
    fetchActivities();
  }, [dispatch]);

  // ── Derived state ──────────────────────────────────────────────
  const filtered = masterActivities.filter((a: MasterActivity) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        a.title.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q)) &&
      (!filterType || a.activityType === filterType)
    );
  });

  const usageCount = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    masterActivities.forEach((a: any) => {
      map[a._id] = 0;
    });
    packages.forEach((pkg: any) =>
      pkg.itinerary.forEach((day: any) =>
        day.activities.forEach((act: any) => {
          if (act.activityRef && map[act.activityRef] !== undefined) {
            map[act.activityRef]++;
          }
        }),
      ),
    );
    return map;
  }, [masterActivities, packages]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleSave = async (data: MasterActivity) => {
    if (!modal) return;
    try {
      if (modal.mode === "create") {
        const result = await api.create(data);
        if (result.success && result.insertedId) {
          dispatch(addMasterActivity({ ...data, _id: result.insertedId }));
        }
      } else {
        const result = await api.update(data);
        if (result.success) {
          dispatch(updateMasterActivity(data));
        }
      }
      setModal(null);
    } catch (err) {
      console.error("ACTIVITY SAVE ERROR:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const count = usageCount[id] ?? 0;
    const confirmed = window.confirm(
      count > 0
        ? `Used in ${count} package(s). Continue?`
        : "Delete this master activity?",
    );
    if (!confirmed) return;
    try {
      await api.delete(id);
      dispatch(deleteMasterActivity(id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const totalUsages = Object.values(usageCount).reduce((a, b) => a + b, 0);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Ic.Search />
          </div>
          <Inp
            className="pl-9"
            placeholder="Search activities…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <Sel
          className="w-40"
          options={OPTIONS.activityType}
          placeholder="All Types"
          value={filterType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilterType(e.target.value)
          }
        />
        {filterType && (
          <Btn variant="ghost" size="sm" onClick={() => setFilterType("")}>
            Clear
          </Btn>
        )}
        <Btn
          className="ml-auto"
          onClick={() => setModal({ mode: "create", data: null })}
        >
          <Ic.Plus />
          New Activity
        </Btn>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No activities found</p>
          </div>
        )}
        {filtered.map((act: any) => {
          const usage = usageCount[act._id] ?? 0;
          return (
            <Card key={act._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={cls(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm",
                      ACT_BADGE[act.activityType],
                    )}
                  >
                    <Ic.Activity />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900">
                        {act.title}
                      </h3>
                      <Badge
                        className={cls(
                          "border",
                          typeCls[act.activityType] ??
                            "bg-gray-50 text-gray-600 border-gray-200",
                        )}
                      >
                        {act.activityType}
                      </Badge>
                      {usage > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <Ic.Link />
                          Used in {usage} pkg
                        </span>
                      )}
                    </div>
                    {act.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Ic.MapPin />
                        {act.location}
                      </p>
                    )}
                    {act.defaultDuration && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Ic.Clock />
                        {act.defaultDuration}
                      </p>
                    )}
                    {act.description && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                        {act.description}
                      </p>
                    )}
                    {act.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {act.tags.map((t: string) => (
                          <span
                            key={t}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setModal({ mode: "edit", data: act })}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Ic.Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(act._id)}
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

      <p className="text-xs text-gray-400 text-center">
        {masterActivities.length} master activities · {totalUsages} total usages
      </p>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.mode === "create"
            ? "Create Master Activity"
            : "Edit Master Activity"
        }
      >
        <MasterActivityForm
          initial={modal?.data ?? null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      </Modal>
    </div>
  );
};
