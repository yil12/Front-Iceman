// LocalStorageContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import useShowModal from "../component/hooks/useShowModal";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import type { GeojsonProps } from "../interface/geojson.interface";



/* ===========================
   TIPOS
=========================== */

interface ModalProps {
  modalOpen: boolean;
  selectedData: Feature<Geometry, GeoJsonProperties> | null;
  relatedFeatures?: Feature<Geometry, GeoJsonProperties>[];
  handleFeatureClick: (feature: Feature) => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type GeojsonMap = Record<string, GeojsonProps>;

interface LocalStorageContextType {
  value: GeojsonMap;
  setValue: (newValue: GeojsonMap) => void;
  modal: ModalProps;
  visibility: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
  geoChipArray: string[];
  addGeoChip: (fileName: string) => void;
  removeGeoChip: (fileName: string) => void;
}

/* ===========================
   CONTEXT
=========================== */

const LocalStorageContext =
  createContext<LocalStorageContextType | undefined>(undefined);

/* ===========================
   PROVIDER
=========================== */

export const LocalStorageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const modal = useShowModal();

  /* ---------- VALUE (GeojsonMap) ---------- */

  const [value, setValueState] = useState<GeojsonMap>(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  });

  const setValue = (newValue: GeojsonMap) => {
    setValueState(newValue);
    localStorage.setItem("user", JSON.stringify(newValue));
    window.dispatchEvent(new Event("local-storage"));
  };

  /* ---------- VISIBILITY ---------- */

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ---------- GEOCHIP ---------- */

  const [geoChipArray, setGeoChipArray] = useState<string[]>([]);

  const addGeoChip = (fileName: string) => {
    setGeoChipArray((prev) => [...prev, fileName]);
  };

  const removeGeoChip = (fileName: string) => {
    setGeoChipArray((prev) => prev.filter((name) => name !== fileName));
  };

  /* ---------- STORAGE SYNC ---------- */

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        const parsed = event.newValue ? JSON.parse(event.newValue) : {};
        setValueState(parsed);
      }
    };

    const handleCustomChange = () => {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : {};
      setValueState(parsed);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleCustomChange);
    };
  }, []);

  /* ---------- PROVIDER ---------- */

  return (
    <LocalStorageContext.Provider
      value={{
        value,
        setValue,
        modal,
        visibility,
        toggleVisibility,
        geoChipArray,
        addGeoChip,
        removeGeoChip,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

/* ===========================
   HOOK
=========================== */

export const useLocalStorageContext = () => {
  const ctx = useContext(LocalStorageContext);
  if (!ctx) {
    throw new Error(
      "useLocalStorageContext debe usarse dentro de LocalStorageProvider"
    );
  }
  return ctx;
};
