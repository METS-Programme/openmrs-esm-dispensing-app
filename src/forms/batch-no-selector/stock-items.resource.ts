import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import useSWR from "swr";

export const LocationStockItemBatchNo = "LocationStockItemBatchNo";
export const LocationStockItem = "LocationStockItem";
export const StockItemOnly = "StockItemOnly";

export const InventoryGroupByOptions = [
  LocationStockItemBatchNo,
  LocationStockItem,
  StockItemOnly,
] as const;
export type InventoryGroupBy = typeof InventoryGroupByOptions[number];

export interface StockBatchDTO {
  drugUuid: string;
  batchNumber: string;
  expiration: Date;
  stockItemUuid: string;
  quantity: string;
  voided: boolean;
}

export interface StockItemInventory {
  partyUuid: string;
  partyName: string;
  stockItemUuid: string;
  stockBatchUuid: string;
  batchNumber: string;
  quantity: number;
  quantityUoM: string;
  expiration: Date;
}

export interface PagingCriteria {
  startIndex?: number | null;
  limit?: number | null;
}

export interface StockInventoryResult
  extends PageableResult<StockItemInventory> {
  total: StockItemInventory[];
}

export interface ResourceFilterCriteria extends PagingCriteria {
  v?: ResourceRepresentation | null;
  q?: string | null;
  totalCount?: boolean | null;
  limit?: number | null;
}

export interface StockBatchFilter extends ResourceFilterCriteria {
  stockItemUuid?: string | null | undefined;
  excludeExpired?: boolean | null;
  includeStockItemName?: "true" | "false" | "0" | "1";
}
export interface StockItemInventoryFilter extends ResourceFilterCriteria {
  drugUuid?: string | null;
  partyUuid?: string | null;
  dispenseLocationUuid?: string | null;
  includeBatchNo?: boolean | null;
  stockBatchUuid?: string | null;
  groupBy?: InventoryGroupBy | null;
  totalBy?: InventoryGroupBy | null;
  stockOperationUuid?: string | null;
  date?: string | null;
  includeStockItemName?: "true" | "false" | "0" | "1";
  excludeExpired?: boolean | null;
  includeStrength?: number | null;
  includeConceptRefIds?: number | null;
  emptyBatch?: number | null;
  emptyBatchLocationUuid?: string | null;
  dispenseAtLocation?: number | null;
}

export interface ResultLink {
  rel: string;
  uri: string;
}

export interface PageableResult<ResultType> {
  results: ResultType[];
  links: ResultLink[] | null;
  totalCount: number | null;
}

export enum ResourceRepresentation {
  Default = "default",
  Full = "full",
  REF = "ref",
}

export function toQueryParams<T extends ResourceFilterCriteria>(
  filterCriteria?: T | null,
  skipEmptyString = true
): string {
  if (!filterCriteria) return "";
  const queryParams: string = Object.keys(filterCriteria)
    ?.map((key) => {
      const value = filterCriteria[key];
      return (skipEmptyString &&
        (value === false || value === true ? true : value)) ||
        (!skipEmptyString &&
          (value === "" || (value === false || value === true ? true : value)))
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
        : null;
    })
    .filter((o) => o != null)
    .join("&");
  return queryParams.length > 0 ? "?" + queryParams : "";
}

// getStockBatches
export function useStockBatches(filter: StockBatchFilter) {
  const apiUrl = `${restBaseUrl}/stockmanagement/stockbatch${toQueryParams(
    filter
  )}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<StockBatchDTO>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <PageableResult<StockBatchDTO>>{},
    isLoading,
    isError: error,
  };
}

// getStockItemInventory
export function useStockItemInventory(filter: StockItemInventoryFilter) {
  const apiUrl = `${restBaseUrl}/stockmanagement/stockiteminventory${toQueryParams(
    filter
  )}`;
  const { data, error, isLoading } = useSWR<
    {
      data: StockInventoryResult;
    },
    Error
  >(apiUrl, openmrsFetch);

  return {
    items: data?.data || <StockInventoryResult>{},
    isLoading,
    isError: error,
  };
}
