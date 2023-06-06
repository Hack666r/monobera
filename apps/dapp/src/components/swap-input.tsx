"use client";

import React from "react";
import {
  useBeraJs,
  useSelectedAssetWalletBalance,
  type Token,
} from "@bera/berajs";
import { cn } from "@bera/ui";
import { Button } from "@bera/ui/button";
import { Input } from "@bera/ui/input";
import { Progress } from "@bera/ui/progress";

import SelectToken from "./select-token";

type Props = {
  selected: Token;
  selectedTokens: Token[];
  amount: number;
  hideBalance?: boolean;
  onTokenSelection: (token: Token) => void;
  setAmount: (amount: number) => void;
};

export default function SwapInput({
  selected,
  selectedTokens,
  amount,
  hideBalance = false,
  onTokenSelection,
  setAmount,
}: Props) {
  const [focused, setFocused] = React.useState(false);
  const tokenBalance = Number(
    useSelectedAssetWalletBalance(selected.address)?.balance || 0,
  );

  const { account } = useBeraJs();

  const exceeding = amount > tokenBalance;
  const progress = tokenBalance && ((amount / tokenBalance) * 100) | 0;
  return (
    <>
      <div
        className={cn(
          "flex flex-row flex-wrap justify-between gap-3 rounded-lg border border-input bg-input p-3 pr-6",
          focused && "border-border",
        )}
      >
        <SelectToken
          token={selected}
          onTokenSelection={onTokenSelection}
          selectedTokens={selectedTokens}
        />
        <Input
          type="number"
          step="any"
          min="0"
          placeholder="0.0"
          className="w-100 grow border-0 p-0 text-right text-lg outline-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={amount > 0 ? amount : ""}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />
        {account ? (
          <div className="w-full pl-4">
            {hideBalance ? null : (
              <div className="flex items-center justify-between">
                <p>
                  <Button
                    variant="link"
                    className="text-md text-default h-8 p-0"
                    onClick={() => setAmount(tokenBalance || 0)}
                  >
                    Balance: {tokenBalance}
                  </Button>
                </p>
                <p>${tokenBalance && tokenBalance * 0.69}</p>
              </div>
            )}
            {!hideBalance && amount ? (
              <Progress
                value={exceeding ? 100 : progress}
                className={cn("h-2", exceeding && "bg-destructive")}
              />
            ) : null}
            {!hideBalance && exceeding ? (
              <p className="text-destructive">
                You&apos;re exceeding your balance
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
