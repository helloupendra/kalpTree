import { INIT_PACKAGES } from "@/components/admin/Packages/utils/mockData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── TYPES ────────────────────────────────────────────────────────
export interface Price {
  currency: string;
  amount: string | number;
}

export interface MealInclusions {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface DayActivity {
  id: string;
  activityRef: string | null;
  time: string;
  customTitle: string;
  customDescription: string;
  customImages: string[];
  guideIncluded: boolean;
  ticketIncluded: boolean;
  coverTitle: string;
}

export interface DayHotel {
  id: string;
  hotelRef: string | null;
  customRoomType: string;
  checkInTime: string;
  checkOutTime: string;
  customNotes: string;
  customImages: string[];
  mealInclusions: MealInclusions;
}

export interface Transfer {
  id: string;
  transferType: string;
  vehicleType: string;
  from: string;
  to: string;
  pickupTime: string;
  dropTime: string;
  notes: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  city: string;
  dayType: string;
  mealsIncluded: string[];
  notes: string;
  description?: string;
  hotelStays: DayHotel[];
  transfers: Transfer[];
  activities: DayActivity[];
}

export interface QuickInfo {
  destinationsCovered: string;
  duration: string;
  startPoint: string;
  endPoint: string;
}

export interface AdditionalInfo {
  aboutDestination: string;
  quickInfo: QuickInfo;
  experiencesCovered: string[];
  notToMiss: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface KnowBeforeYouGo {
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
  longDescription?: string;
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

export interface MasterActivity {
  _id: string;
  title: string;
  description: string;
  activityType: string;
  defaultDuration: string;
  location: string;
  tags: string[];
  images: string[];
}

export interface MasterHotel {
  _id: string;
  hotelName: string;
  city: string;
  starRating: string;
  description: string;
  roomTypes: string[];
  amenities: string[];
  images: string[];
}

export interface PackageState {
  packages: Package[];
  masterActivities: MasterActivity[];
  masterHotels: MasterHotel[];
  selectedId: string | null;
  page: string;
  isLoading: boolean;
}

// ─── INITIAL STATE ────────────────────────────────────────────────
const initialState: PackageState = {
  packages: [...INIT_PACKAGES],
  masterActivities: [],
  masterHotels: [],
  selectedId: null,
  page: "dashboard",
  isLoading: false,
};

// ─── SLICE ────────────────────────────────────────────────────────
const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    // ── Navigation ──────────────────────────────────────────────
    setPage(state, action: PayloadAction<string>) {
      state.page = action.payload;
    },
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },

    // ── Packages ────────────────────────────────────────────────
    setPackages(state, action: PayloadAction<Package[]>) {
      state.packages = action.payload;
    },
    addPackage(state, action: PayloadAction<Package>) {
      state.packages.push(action.payload);
    },
    updatePackage(state, action: PayloadAction<Package>) {
      const index = state.packages.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.packages[index] = action.payload;
    },
    deletePackage(state, action: PayloadAction<string>) {
      state.packages = state.packages.filter((p) => p.id !== action.payload);
    },

    // ── Master Activities ────────────────────────────────────────
    setMasterActivities(state, action: PayloadAction<MasterActivity[]>) {
      state.masterActivities = action.payload;
    },
    addMasterActivity(state, action: PayloadAction<MasterActivity>) {
      state.masterActivities.push(action.payload);
    },
    updateMasterActivity(state, action: PayloadAction<MasterActivity>) {
      const index = state.masterActivities.findIndex(
        (a) => a._id === action.payload._id,
      );
      if (index !== -1) state.masterActivities[index] = action.payload;
    },
    deleteMasterActivity(state, action: PayloadAction<string>) {
      state.masterActivities = state.masterActivities.filter(
        (a) => a._id !== action.payload,
      );
    },

    // ── Master Hotels ────────────────────────────────────────────
    setMasterHotels(state, action: PayloadAction<MasterHotel[]>) {
      state.masterHotels = action.payload;
    },
    addMasterHotel(state, action: PayloadAction<MasterHotel>) {
      state.masterHotels.push(action.payload);
    },
    updateMasterHotel(state, action: PayloadAction<MasterHotel>) {
      const index = state.masterHotels.findIndex(
        (h) => h._id === action.payload._id,
      );
      if (index !== -1) state.masterHotels[index] = action.payload;
    },
    deleteMasterHotel(state, action: PayloadAction<string>) {
      state.masterHotels = state.masterHotels.filter(
        (h) => h._id !== action.payload,
      );
    },

    // ── Loading ──────────────────────────────────────────────────
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setPage,
  setSelectedId,
  setPackages,
  addPackage,
  updatePackage,
  deletePackage,
  setMasterActivities,
  addMasterActivity,
  updateMasterActivity,
  deleteMasterActivity,
  setMasterHotels,
  addMasterHotel,
  updateMasterHotel,
  deleteMasterHotel,
  setLoading,
} = packageSlice.actions;

export default packageSlice.reducer;
