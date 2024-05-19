import React, { ReactNode, useEffect } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { ComboBox, InlineLoading } from "@carbon/react";
import {
  ResourceRepresentation,
  StockItemInventory,
} from "./stock-items.resource";
import { useStockItemBatchInformationHook } from "../batch-information/batch-information.resource";

interface BatchNoSelectorProps<T> {
  placeholder?: string;
  stockItemUuid: string;
  dispenseLocation: string;
  onBatchNoChanged?: (item: StockItemInventory) => void;
  title?: string;
  invalid?: boolean;
  invalidText?: ReactNode;

  // Control
  controllerName: string;
  name: string;
  control: Control<FieldValues, T>;
}

const BatchNoSelector = <T,>(props: BatchNoSelectorProps<T>) => {
  const { items, setStockItemUuid, setLocationUuid, isLoading } =
    useStockItemBatchInformationHook(ResourceRepresentation.Default);

  useEffect(() => {
    setStockItemUuid(props.stockItemUuid);
    setLocationUuid(props.dispenseLocation);
  }, [
    props.dispenseLocation,
    props.stockItemUuid,
    setLocationUuid,
    setStockItemUuid,
  ]);

  if (isLoading) return <InlineLoading status="active" />;

  return (
    <div>
      <Controller
        name={props.controllerName}
        control={props.control}
        render={({ field: { onChange, ref } }) => (
          <ComboBox
            titleText={props.title}
            name={props.name}
            control={props.control}
            controllerName={props.controllerName}
            id={props.name}
            size={"sm"}
            items={items || []}
            onChange={(data: { selectedItem?: StockItemInventory }) => {
              props.onBatchNoChanged?.(data?.selectedItem);
              onChange(data.selectedItem?.stockItemUuid);
            }}
            itemToString={(s: StockItemInventory) =>
              s?.batchNumber
                ? `${s?.batchNumber} | Qty: ${s?.quantity ?? ""} each`
                : ""
            }
            placeholder={props.placeholder}
            invalid={props.invalid}
            invalidText={props.invalidText}
            ref={ref}
          />
        )}
      />
      {isLoading && <InlineLoading status="active" />}
    </div>
  );
};

export default BatchNoSelector;
