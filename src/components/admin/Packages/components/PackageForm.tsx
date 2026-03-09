// "use client";

// import { useMemo, useState } from "react";
// import { emptyAdditionalInfo, parseDays, makeDay, cls } from "../utils/helpers";
// import { DURATION_OPTIONS, OPTIONS, CURRENCIES } from "../utils/constants";
// import { Card, Btn, Inp, TA, Sel, FL } from "./UI";
// import { Ic } from "./Icons";
// import { ItineraryBuilder } from "./ItineraryBuilder";
// import { SummarisedView } from "./SummarisedView";
// import {
//   InclusionsExclusionsSection,
//   KnowBeforeYouGoSection,
// } from "./Inclusions";
// import { FAQSection } from "./FAQ";
// import { AdditionalInfoSection } from "./AdditionalInfo";
// import { emptyPkg } from "../PackagePanel";
// import { useParams, useRouter } from "next/navigation";
// import { INIT_PACKAGES } from "../utils/mockData";

// // ─── PACKAGE FORM ─────────────────────────────────────────────────
// export const PackageForm = ({ mode }) => {
//   const params = useParams();
//   const id = params.id;
//   const initial = useMemo(() => {
//     if (id) {
//       const selectedPkg = INIT_PACKAGES.find((p) => p.id === id);
//       console.log(selectedPkg);
//       return selectedPkg;
//     } else {
//       return emptyPkg();
//     }
//   }, [mode]);
//   const [form, setForm] = useState(initial);
//   const [itinerary, setItinerary] = useState(initial.itinerary || []);
//   const [faqs, setFaqs] = useState(initial.faqs || []);
//   const [inclusions, setInclusions] = useState(initial.inclusions || []);
//   const [ exclusions, setExclusions] = useState(initial.exclusions || []);
//   const [knowBeforeYouGo, setKnowBeforeYouGo] = useState(
//     initial.knowBeforeYouGo || [],
//   );
//   const [additionalInfo, setAdditionalInfo] = useState(
//     initial.additionalInfo || emptyAdditionalInfo(),
//   );
//   const router = useRouter();
//   const [tab, setTab] = useState("builder");
//   const upd = (f, v) => setForm((p) => ({ ...p, [f]: v }));
//   const updPx = (f, v) =>
//     setForm((p) => ({ ...p, price: { ...p.price, [f]: v } }));

//   const handleDurationChange = (dur) => {
//     upd("tripDuration", dur);
//     const n = parseDays(dur);
//     setItinerary((old) => {
//       if (n === old.length) return old;
//       if (n > old.length)
//         return [
//           ...old,
//           ...Array.from({ length: n - old.length }, (_, i) =>
//             makeDay(old.length + i + 1),
//           ),
//         ];
//       return old.slice(0, n);
//     });
//   };

//   const currObj =
//     CURRENCIES.find((c) => c.code === (form.price?.currency || "INR")) ||
//     CURRENCIES[0];
//   const sym = currObj.symbol;

//   const onSave =
//     mode != "edit"
//       ? async (data) => {
//           try {
//             if (!data.itinerary) data.itinerary = [];
//             const formattedPackage = {
//               ...data,
//               itinerary: (data.itinerary || []).map((day, index) => ({
//                 id: day.id,
//                 dayNumber: index + 1,
//                 title: day.title,
//                 city: day.city,
//                 dayType: day.dayType,
//                 mealsIncluded: day.mealsIncluded || [],
//                 notes: day.notes,
//                 description: day.description,
//                 hotelStays: (day.hotelStays || []).map((hotel) => ({
//                   id: hotel.id,
//                   hotelRef: hotel.hotelRef,
//                   roomType: hotel.roomType,
//                   checkInTime: hotel.checkInTime,
//                   checkOutTime: hotel.checkOutTime,
//                   mealInclusions: hotel.mealInclusions,
//                   notes: hotel.notes,
//                 })),
//                 activities: (day.activities || []).map((act) => ({
//                   id: act.id,
//                   activityRef: act.activityRef,
//                   time: act.time,
//                   coverTitle: act.coverTitle,
//                   customTitle: act.customTitle,
//                   customDescription: act.customDescription,
//                   guideIncluded: act.guideIncluded,
//                   ticketIncluded: act.ticketIncluded,
//                 })),
//                 transfers: (day.transfers || []).map((tr) => ({
//                   id: tr.id,
//                   pickupTime: tr.pickupTime,
//                   from: tr.from,
//                   to: tr.to,
//                   vehicleType: tr.vehicleType,
//                 })),
//               })),
//             };
//             const res = await fetch("/api/packages", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(formattedPackage),
//             });
//             const result = await res.json();
//             if (result.success) {
//               alert("Package saved ✅");
//               fetchPackages();
//               setPage("packages");
//             }
//           } catch (err) {
//             console.error(err);
//           }
//         }
//       : async (data) => {
//           try {
//             const res = await fetch("/api/packages", {
//               method: "PUT",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(data),
//             });
//             const result = await res.json();
//             if (result.success) {
//               alert("Package updated ✅");
//               fetchPackages();
//               setPage("packages");
//             }
//           } catch (err) {
//             console.error(err);
//           }
//         };

//   const onCancel = () => {
//     router.back();
//   };

//   return (
//     <div className="max-w-5xl mx-auto pb-10 space-y-6">
//       {/* SECTION 1 — Package Info */}
//       <Card className="p-6">
//         <div className="flex items-center gap-3 mb-5">
//           <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold">
//             1
//           </div>
//           <h3 className="font-bold text-gray-900">Package Information</h3>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="col-span-2">
//             <FL required>Package Title</FL>
//             <Inp
//               placeholder="e.g. Bali Royal Escape"
//               value={form.title || ""}
//               onChange={(e) => upd("title", e.target.value)}
//             />
//           </div>
//           <div>
//             <FL required>Destination</FL>
//             <Inp
//               placeholder="e.g. Bali, Indonesia"
//               value={form.destination || ""}
//               onChange={(e) => upd("destination", e.target.value)}
//             />
//           </div>
//           <div>
//             <FL required>Trip Duration</FL>
//             <Sel
//               options={DURATION_OPTIONS}
//               placeholder="Select duration"
//               value={form.tripDuration || ""}
//               onChange={(e) => handleDurationChange(e.target.value)}
//             />
//             {itinerary.length > 0 && (
//               <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
//                 <Ic.Check />
//                 {itinerary.length} days auto-generated
//               </p>
//             )}
//           </div>

//           {/* Price + Currency */}
//           <div className="col-span-2">
//             <FL required>Price per Person</FL>
//             <div className="flex gap-3">
//               <div className="w-56 flex-shrink-0">
//                 <select
//                   value={form.price?.currency || "INR"}
//                   onChange={(e) => updPx("currency", e.target.value)}
//                   className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
//                 >
//                   {CURRENCIES.map((c) => (
//                     <option key={c.code} value={c.code}>
//                       {c.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="relative flex-1">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold select-none">
//                   {sym}
//                 </span>
//                 <Inp
//                   type="number"
//                   placeholder="0.00"
//                   value={form.price?.amount || ""}
//                   onChange={(e) => updPx("amount", e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//             </div>
//             {form.price?.amount && Number(form.price.amount) > 0 && (
//               <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
//                 <Ic.Check />
//                 Display:{" "}
//                 <strong className="ml-1 text-blue-900">
//                   {sym}
//                   {Number(form.price.amount).toLocaleString("en-IN")}{" "}
//                   {form.price?.currency}
//                 </strong>
//               </p>
//             )}
//           </div>

//           <div>
//             <FL>Travel Style</FL>
//             <Sel
//               options={OPTIONS.travelStyle}
//               placeholder="Select…"
//               value={form.travelStyle || ""}
//               onChange={(e) => upd("travelStyle", e.target.value)}
//             />
//           </div>
//           <div>
//             <FL>Exclusivity</FL>
//             <Sel
//               options={OPTIONS.exclusivity}
//               placeholder="Select…"
//               value={form.exclusivityLevel || ""}
//               onChange={(e) => upd("exclusivityLevel", e.target.value)}
//             />
//           </div>
//           <div className="col-span-2">
//             <FL>Short Description</FL>
//             <Inp
//               placeholder="1-line teaser for listing cards"
//               value={form.shortDescription || ""}
//               onChange={(e) => upd("shortDescription", e.target.value)}
//             />
//           </div>
//           <div className="col-span-2">
//             <FL optional>Full Description</FL>
//             <TA
//               placeholder="Detailed narrative about the package…"
//               value={form.longDescription || ""}
//               onChange={(e) => upd("longDescription", e.target.value)}
//               rows={3}
//             />
//           </div>
//         </div>
//       </Card>

//       {/* SECTION 2 — Itinerary Builder */}
//       <Card className="overflow-hidden">
//         <div className="border-b border-gray-100 bg-gray-50 px-6 pt-4 pb-0">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-3">
//               <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold">
//                 2
//               </div>
//               <h3 className="font-bold text-gray-900">Itinerary Builder</h3>
//               {itinerary.length > 0 && (
//                 <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
//                   {itinerary.length} Days
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="flex gap-0">
//             {[
//               [
//                 "builder",
//                 <>
//                   <Ic.Package />
//                   Builder
//                 </>,
//               ],
//               [
//                 "summary",
//                 <>
//                   <Ic.Summary />
//                   Summarised View
//                 </>,
//               ],
//             ].map(([key, label]) => (
//               <button
//                 key={key}
//                 onClick={() => setTab(key)}
//                 className={cls(
//                   "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all",
//                   tab === key
//                     ? "border-blue-950 text-blue-950 bg-white"
//                     : "border-transparent text-gray-500 hover:text-gray-700",
//                 )}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="p-6">
//           {tab === "builder" && (
//             <ItineraryBuilder
//               itinerary={itinerary}
//               setItinerary={setItinerary}
//             />
//           )}
//           {tab === "summary" && (
//             <SummarisedView itinerary={itinerary} pkg={form} />
//           )}
//         </div>
//       </Card>

//       {/* SECTION 3 — Inclusions & Exclusions */}
//       <InclusionsExclusionsSection
//         inclusions={inclusions}
//         exclusions={exclusions}
//         onChangeInc={setInclusions}
//         onChangeExc={setExclusions}
//       />

//       {/* SECTION 4 — FAQs */}
//       <FAQSection faqs={faqs} onChange={setFaqs} sectionNum={4} />

//       {/* SECTION 5 — Know Before You Go */}
//       <KnowBeforeYouGoSection
//         points={knowBeforeYouGo}
//         onChange={setKnowBeforeYouGo}
//       />

//       {/* SECTION 6 — Additional Information */}
//       <AdditionalInfoSection
//         info={additionalInfo}
//         onChange={setAdditionalInfo}
//       />

//       <div className="flex justify-end gap-3">
//         <Btn variant="outline" onClick={onCancel}>
//           Cancel
//         </Btn>
//         <Btn
//           variant="success"
//           onClick={() =>
//             onSave({
//               ...form,
//               itinerary,
//               faqs,
//               inclusions,
//               exclusions,
//               knowBeforeYouGo,
//               additionalInfo,
//             })
//           }
//         >
//           {mode === "create" ? "✓ Create Package" : "✓ Save Changes"}
//         </Btn>
//       </div>
//     </div>
//   );
// };

"use client";

import { useMemo, useState } from "react";
import { emptyAdditionalInfo, parseDays, makeDay, cls } from "../utils/helpers";
import { DURATION_OPTIONS, OPTIONS, CURRENCIES } from "../utils/constants";
import { Card, Btn, Inp, TA, Sel, FL } from "./UI";
import { Ic } from "./Icons";
import { ItineraryBuilder } from "./ItineraryBuilder";
import { SummarisedView } from "./SummarisedView";
import {
  InclusionsExclusionsSection,
  KnowBeforeYouGoSection,
} from "./Inclusions";
import { FAQSection } from "./FAQ";
import { AdditionalInfoSection } from "./AdditionalInfo";
import { emptyPkg } from "../PackagePanel";
import { useParams, useRouter } from "next/navigation";
import { INIT_PACKAGES } from "../utils/mockData";
import { useDispatch } from "react-redux";
import {
  addPackage,
  updatePackage,
} from "@/hooks/slices/packages/PackagesSlice";
import { AppDispatch } from "@/store/store";

// ─── TYPES ────────────────────────────────────────────────────────

type FormMode = "create" | "edit";
type TabKey = "builder" | "summary";

interface Price {
  currency: string;
  amount: string | number;
}

interface MealInclusions {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface DayHotel {
  id: string;
  hotelRef: string | null;
  roomType: string;
  checkInTime: string;
  checkOutTime: string;
  mealInclusions: MealInclusions;
  notes: string;
  customRoomType?: string;
  customNotes?: string;
  customImages?: string[];
}

interface DayActivity {
  id: string;
  activityRef: string | null;
  time: string;
  coverTitle: string;
  customTitle: string;
  customDescription: string;
  customImages?: string[];
  guideIncluded: boolean;
  ticketIncluded: boolean;
}

interface Transfer {
  id: string;
  pickupTime: string;
  dropTime?: string;
  from: string;
  to: string;
  vehicleType: string;
  transferType?: string;
  notes?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  city: string;
  dayType: string;
  mealsIncluded: string[];
  notes: string;
  description: string;
  hotelStays: DayHotel[];
  transfers: Transfer[];
  activities: DayActivity[];
}

interface QuickInfo {
  destinationsCovered: string;
  duration: string;
  startPoint: string;
  endPoint: string;
}

interface AdditionalInfo {
  aboutDestination: string;
  quickInfo: QuickInfo;
  experiencesCovered: string[];
  notToMiss: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface KnowBeforeYouGo {
  id: string;
  point: string;
}

interface PackageFormData {
  id: string;
  title: string;
  destination: string;
  tripDuration: string;
  travelStyle: string;
  tourType: string;
  exclusivityLevel: string;
  price: Price;
  shortDescription: string;
  longDescription: string;
  availability: {
    availableMonths: string[];
    fixedDepartureDates: string[];
    blackoutDates: string[];
  };
  inclusions: string[];
  exclusions: string[];
  knowBeforeYouGo: KnowBeforeYouGo[];
  additionalInfo: AdditionalInfo;
  faqs: FAQ[];
  itinerary: ItineraryDay[];
  createdAt: string;
}

interface ApiResult {
  success: boolean;
  data?: PackageFormData;
  insertedId?: string;
}

interface PackageFormProps {
  mode: FormMode;
}

// ─── TAB CONFIG ───────────────────────────────────────────────────

const TABS: Array<{ key: TabKey; label: React.ReactNode }> = [
  {
    key: "builder",
    label: (
      <>
        <Ic.Package />
        Builder
      </>
    ),
  },
  {
    key: "summary",
    label: (
      <>
        <Ic.Summary />
        Summarised View
      </>
    ),
  },
];

// ─── PACKAGE FORM ─────────────────────────────────────────────────

export const PackageForm = ({ mode }: PackageFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const id = params.id;

  const initial = useMemo<PackageFormData>(() => {
    if (id) {
      const found = INIT_PACKAGES.find((p) => p.id === id);
      if (found) return found as PackageFormData;
    }
    return emptyPkg();
  }, [id]);

  const [form, setForm] = useState<PackageFormData>(initial);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    initial.itinerary ?? [],
  );
  const [faqs, setFaqs] = useState<FAQ[]>(initial.faqs ?? []);
  const [inclusions, setInclusions] = useState<string[]>(
    initial.inclusions ?? [],
  );
  const [exclusions, setExclusions] = useState<string[]>(
    initial.exclusions ?? [],
  );
  const [knowBeforeYouGo, setKnowBeforeYouGo] = useState<KnowBeforeYouGo[]>(
    initial.knowBeforeYouGo ?? [],
  );
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>(
    initial.additionalInfo ?? emptyAdditionalInfo(),
  );
  const [tab, setTab] = useState<TabKey>("builder");

  // ── Field updaters ─────────────────────────────────────────────
  const upd = <K extends keyof PackageFormData>(
    field: K,
    value: PackageFormData[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const updPx = <K extends keyof Price>(field: K, value: Price[K]) =>
    setForm((prev) => ({ ...prev, price: { ...prev.price, [field]: value } }));

  // ── Duration change ────────────────────────────────────────────
  const handleDurationChange = (dur: string) => {
    upd("tripDuration", dur);
    const n = parseDays(dur);
    setItinerary((old) => {
      if (n === old.length) return old;
      if (n > old.length)
        return [
          ...old,
          ...Array.from({ length: n - old.length }, (_, i) =>
            makeDay(old.length + i + 1),
          ),
        ];
      return old.slice(0, n);
    });
  };

  // ── Currency display ───────────────────────────────────────────
  const currObj =
    CURRENCIES.find((c) => c.code === (form.price?.currency ?? "INR")) ??
    CURRENCIES[0];
  const sym = currObj.symbol;

  // ── Formatted itinerary for API ────────────────────────────────
  const formatItinerary = (days: ItineraryDay[]) =>
    days.map((day, index) => ({
      id: day.id,
      dayNumber: index + 1,
      title: day.title,
      city: day.city,
      dayType: day.dayType,
      mealsIncluded: day.mealsIncluded ?? [],
      notes: day.notes,
      description: day.description,
      hotelStays: (day.hotelStays ?? []).map((hotel) => ({
        id: hotel.id,
        hotelRef: hotel.hotelRef,
        roomType: hotel.roomType,
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        mealInclusions: hotel.mealInclusions,
        notes: hotel.notes,
      })),
      activities: (day.activities ?? []).map((act) => ({
        id: act.id,
        activityRef: act.activityRef,
        time: act.time,
        coverTitle: act.coverTitle,
        customTitle: act.customTitle,
        customDescription: act.customDescription,
        guideIncluded: act.guideIncluded,
        ticketIncluded: act.ticketIncluded,
      })),
      transfers: (day.transfers ?? []).map((tr) => ({
        id: tr.id,
        pickupTime: tr.pickupTime,
        from: tr.from,
        to: tr.to,
        vehicleType: tr.vehicleType,
      })),
    }));

  // ── Save handlers ──────────────────────────────────────────────
  const handleCreate = async (data: PackageFormData) => {
    try {
      const payload = {
        ...data,
        itinerary: formatItinerary(data.itinerary ?? []),
      };
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: ApiResult = await res.json();
      if (result.success && result.insertedId) {
        dispatch(addPackage({ ...payload, id: result.insertedId }));
        alert("Package saved ✅");
        router.back();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (data: PackageFormData) => {
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: ApiResult = await res.json();
      if (result.success) {
        dispatch(updatePackage(data));
        alert("Package updated ✅");
        router.back();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSave = (data: PackageFormData) =>
    mode === "edit" ? handleUpdate(data) : handleCreate(data);

  const onCancel = () => router.back();

  // ── Merged save payload ────────────────────────────────────────
  const buildPayload = (): PackageFormData => ({
    ...form,
    itinerary,
    faqs,
    inclusions,
    exclusions,
    knowBeforeYouGo,
    additionalInfo,
  });

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6">
      {/* SECTION 1 — Package Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold">
            1
          </div>
          <h3 className="font-bold text-gray-900">Package Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FL required>Package Title</FL>
            <Inp
              placeholder="e.g. Bali Royal Escape"
              value={form.title ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                upd("title", e.target.value)
              }
            />
          </div>
          <div>
            <FL required>Destination</FL>
            <Inp
              placeholder="e.g. Bali, Indonesia"
              value={form.destination ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                upd("destination", e.target.value)
              }
            />
          </div>
          <div>
            <FL required>Trip Duration</FL>
            <Sel
              options={DURATION_OPTIONS}
              placeholder="Select duration"
              value={form.tripDuration ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleDurationChange(e.target.value)
              }
            />
            {itinerary.length > 0 && (
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <Ic.Check />
                {itinerary.length} days auto-generated
              </p>
            )}
          </div>

          {/* Price + Currency */}
          <div className="col-span-2">
            <FL required>Price per Person</FL>
            <div className="flex gap-3">
              <div className="w-56 flex-shrink-0">
                <select
                  value={form.price?.currency ?? "INR"}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updPx("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold select-none">
                  {sym}
                </span>
                <Inp
                  type="number"
                  placeholder="0.00"
                  value={form.price?.amount ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updPx("amount", e.target.value)
                  }
                  className="pl-8"
                />
              </div>
            </div>
            {form.price?.amount && Number(form.price.amount) > 0 && (
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <Ic.Check />
                Display:{" "}
                <strong className="ml-1 text-blue-900">
                  {sym}
                  {Number(form.price.amount).toLocaleString("en-IN")}{" "}
                  {form.price?.currency}
                </strong>
              </p>
            )}
          </div>

          <div>
            <FL>Travel Style</FL>
            <Sel
              options={OPTIONS.travelStyle}
              placeholder="Select…"
              value={form.travelStyle ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                upd("travelStyle", e.target.value)
              }
            />
          </div>
          <div>
            <FL>Exclusivity</FL>
            <Sel
              options={OPTIONS.exclusivity}
              placeholder="Select…"
              value={form.exclusivityLevel ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                upd("exclusivityLevel", e.target.value)
              }
            />
          </div>
          <div className="col-span-2">
            <FL>Short Description</FL>
            <Inp
              placeholder="1-line teaser for listing cards"
              value={form.shortDescription ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                upd("shortDescription", e.target.value)
              }
            />
          </div>
          <div className="col-span-2">
            <FL optional>Full Description</FL>
            <TA
              placeholder="Detailed narrative about the package…"
              value={form.longDescription ?? ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                upd("longDescription", e.target.value)
              }
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* SECTION 2 — Itinerary Builder */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 pt-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="font-bold text-gray-900">Itinerary Builder</h3>
              {itinerary.length > 0 && (
                <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  {itinerary.length} Days
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-0">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cls(
                  "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all",
                  tab === key
                    ? "border-blue-950 text-blue-950 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {tab === "builder" && (
            <ItineraryBuilder
              itinerary={itinerary}
              setItinerary={setItinerary}
            />
          )}
          {tab === "summary" && (
            <SummarisedView itinerary={itinerary} pkg={form} />
          )}
        </div>
      </Card>

      {/* SECTION 3 — Inclusions & Exclusions */}
      <InclusionsExclusionsSection
        inclusions={inclusions}
        exclusions={exclusions}
        onChangeInc={setInclusions}
        onChangeExc={setExclusions}
      />

      {/* SECTION 4 — FAQs */}
      <FAQSection faqs={faqs} onChange={setFaqs} sectionNum={4} />

      {/* SECTION 5 — Know Before You Go */}
      <KnowBeforeYouGoSection
        points={knowBeforeYouGo}
        onChange={setKnowBeforeYouGo}
      />

      {/* SECTION 6 — Additional Information */}
      <AdditionalInfoSection
        info={additionalInfo}
        onChange={setAdditionalInfo}
      />

      <div className="flex justify-end gap-3">
        <Btn variant="outline" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn variant="success" onClick={() => onSave(buildPayload())}>
          {mode === "create" ? "✓ Create Package" : "✓ Save Changes"}
        </Btn>
      </div>
    </div>
  );
};
