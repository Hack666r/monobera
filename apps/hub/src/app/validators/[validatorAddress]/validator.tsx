"use client";

import React from "react";
import { notFound } from "next/navigation";
import { useSelectedValidator } from "@bera/berajs";
import { type Address } from "viem";

import { ValidatorTabs } from "../components/validator-tabs";
import ValidatorDetails from "./validator-details";

export default function Validator({
  validatorAddress,
}: {
  validatorAddress: Address;
}) {
  const {
    data: validator,
    isLoading,
    isValidating,
  } = useSelectedValidator(validatorAddress);
  if (!isLoading && !isValidating && !validator) return notFound();

  return (
    <div className="relative flex flex-col">
      <ValidatorDetails validatorAddress={validatorAddress} />
      <ValidatorTabs validatorAddress={validatorAddress} />
    </div>
  );
}
