import { useEffect, useState } from "react";
import {
  LocationStockItemBatchNo,
  ResourceRepresentation,
  StockItemInventoryFilter,
  useStockItemInventory,
} from "../batch-no-selector/stock-items.resource";

export function useStockItemBatchInformationHook(v?: ResourceRepresentation) {
  const [stockItemFilter, setStockItemFilter] =
    useState<StockItemInventoryFilter>({
      v: v || ResourceRepresentation.Default,
    });

  const [stockItemUuid, setStockItemUuid] = useState<string | null>();
  const [locationUuid, setLocationUuid] = useState<string | null>();

  useEffect(() => {
    setStockItemFilter({
      startIndex: 0,
      v: ResourceRepresentation.Default,
      limit: 10,
      totalCount: true,
      drugUuid: stockItemUuid,
      dispenseLocationUuid: locationUuid,
      emptyBatchLocationUuid: locationUuid,
      includeBatchNo: true,
      includeStrength: 1,
      includeConceptRefIds: 1,
      emptyBatch: 1,
      dispenseAtLocation: 1,
      groupBy: LocationStockItemBatchNo,
    });
  }, [stockItemUuid, locationUuid]);

  const { items, isLoading, isError } = useStockItemInventory(stockItemFilter);

  return {
    items: items.results ?? [],
    totalCount: items.totalCount,
    isLoading,
    isError,
    setStockItemUuid,
    setLocationUuid,
  };
}
