"use client";

import { useEffect } from "react";
import { emptyAdditionalInfo, uid } from "./utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setPackages } from "@/hooks/slices/packages/PackagesSlice";
import { PackagesListing } from "./components/Layout";
import { AppDispatch, RootState } from "@/store/store";

// ─── TYPES ────────────────────────────────────────────────────────

interface Price {
  currency: string;
  amount: string | number;
}

interface Availability {
  availableMonths: string[];
  fixedDepartureDates: string[];
  blackoutDates: string[];
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

export interface Package {
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
  availability: Availability;
  inclusions: string[];
  exclusions: string[];
  knowBeforeYouGo: KnowBeforeYouGo[];
  additionalInfo: AdditionalInfo;
  faqs: FAQ[];
  itinerary: unknown[];
  createdAt: string;
}

interface ApiResult {
  success: boolean;
  data?: Package[];
}

export const emptyPkg = (): Package => ({
  id: uid(),
  title: "",
  destination: "",
  tripDuration: "",
  travelStyle: "",
  tourType: "",
  exclusivityLevel: "Premium",
  price: { currency: "INR", amount: "" },
  shortDescription: "",
  longDescription: "",
  availability: {
    availableMonths: [],
    fixedDepartureDates: [],
    blackoutDates: [],
  },
  inclusions: [],
  exclusions: [],
  knowBeforeYouGo: [],
  additionalInfo: emptyAdditionalInfo(),
  faqs: [],
  itinerary: [],
  createdAt: new Date().toISOString().split("T")[0],
});

// ─── APP ROOT ─────────────────────────────────────────────────────

export default function PackagePanel() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/admin/packages");
        const result: ApiResult = await res.json();
        if (result.success && result.data) {
          dispatch(setPackages(result?.data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPackages();
  }, [dispatch]);

  // ── Derived state ──────────────────────────────────────────────
  // const selectedPkg = packages.find((p) => p.id === selectedId);
  // const meta = getPageMeta(page, packages, selectedPkg);

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="p-6 max-w-[1400px]">
        <PackagesListing />
        {/* {page === "edit" && selectedPkg && (
            <PackageForm
              key={selectedPkg.id}
              initial={selectedPkg}
              mode="edit"
              onSave={handleEdit}
              onCancel={() => setPage("packages")}
            />
          )}
          {page === "view" && selectedPkg && (
            <ViewPackage pkg={selectedPkg} onEdit={() => setPage("edit")} />
          )}
          {page === "master-activities" && <MasterActivitiesPage />}
          {page === "master-hotels" && <MasterHotelsPage />} */}
      </div>
    </div>
  );
}
