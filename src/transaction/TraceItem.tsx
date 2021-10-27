import React from "react";
import AddressHighlighter from "../components/AddressHighlighter";
import DecoratedAddressLink from "../components/DecoratedAddressLink";
import { TransactionData } from "../types";
import { rawInputTo4Bytes, use4Bytes } from "../use4Bytes";
import { TraceGroup } from "../useErigonHooks";

type TraceItemProps = {
  t: TraceGroup;
  txData: TransactionData;
  last: boolean;
};

const TraceItem: React.FC<TraceItemProps> = ({ t, txData, last }) => {
  const raw4Bytes = rawInputTo4Bytes(t.input);
  const fourBytesEntry = use4Bytes(raw4Bytes);

  return (
    <>
      <div className="flex">
        <div className="relative w-5">
          <div className="absolute border-l border-b w-full h-full transform -translate-y-1/2"></div>
          {!last && (
            <div className="absolute left-0 border-l w-full h-full transform translate-y-1/2"></div>
          )}
        </div>
        <div className="flex items-baseline border rounded px-1 py-px">
          <span className="mr-2">{t.depth}</span>
          <span className="text-xs text-gray-400 lowercase">{t.type}</span>
          <span>
            <AddressHighlighter address={t.to}>
              <DecoratedAddressLink
                address={t.to}
                miner={t.to === txData.confirmedData?.miner}
                txFrom={t.to === txData.from}
                txTo={t.to === txData.to}
              />
            </AddressHighlighter>
          </span>
          <span>.</span>
          <span className="font-bold text-blue-900">
            {fourBytesEntry ? fourBytesEntry.name : raw4Bytes}
          </span>
          <span>(</span>
          {t.input.length > 10 && (
            <span className="whitespace-nowrap">
              input=[{t.input.slice(10)}]
            </span>
          )}
          <span>)</span>
        </div>
      </div>
      {t.children && (
        <div className="flex">
          <div className={`w-10 ${last ? "" : "border-l"}`}></div>
          <div className="space-y-3">
            {t.children.map((tc, i, a) => (
              <TraceItem
                key={i}
                t={tc}
                txData={txData}
                last={i === a.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TraceItem);
