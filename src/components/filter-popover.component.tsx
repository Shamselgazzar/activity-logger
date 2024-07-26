import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button, Input } from "@nextui-org/react";
import { Filters } from "../models/Filters";
import Image from 'next/image';

interface FilterPopoverProps {
  applyFilters: (filters: Filters) => void;
}

export function FilterPopover({ applyFilters }: FilterPopoverProps) {
  const initialFilters: Filters = {
    location: "",
    actorName: "",
    actorGroup: "",
    actorEmail: "",
    actionName: ""
  };

  const [filters, setFilters] = useState(initialFilters);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    applyFilters(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    applyFilters(initialFilters);
  };

  const handleClose = () => {
    if (triggerButtonRef.current) {
      triggerButtonRef.current.click();
    }
  };


  return (
    <Popover
      placement="bottom"
      showArrow
      offset={10}
      shadow="sm"
    >
      <PopoverTrigger>
        <button
          ref={triggerButtonRef}
          className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded flex items-center justify-center hover:scale-105 w-full sm:w-auto"
        >
          <Image src='/filter.svg' alt='filter icon' width={20} height={20} className="mr-1" />
          FILTER
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="px-1 py-2 w-full">
          <div className="flex justify-between">
            <p className="text-small font-bold text-foreground">Filter Criteria</p>
            <button className="closeButton" onClick={handleClose}>
              Close
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-2 w-full">
            <Input
              name="location"
              label="Location"
              size="sm"
              variant="bordered"
              value={filters.location}
              onChange={handleChange}
            />
            <Input
              name="actorName"
              label="Actor Name"
              size="sm"
              variant="bordered"
              value={filters.actorName}
              onChange={handleChange}
            />
            <Input
              name="actorGroup"
              label="Actor Group"
              size="sm"
              variant="bordered"
              value={filters.actorGroup}
              onChange={handleChange}
            />
            <Input
              name="actorEmail"
              label="Actor Email"
              size="sm"
              variant="bordered"
              value={filters.actorEmail}
              onChange={handleChange}
            />
            <Input
              name="actionName"
              label="Action Name"
              size="sm"
              variant="bordered"
              value={filters.actionName}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={handleSubmit}>Apply</Button>
            <Button className="ml-2" onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
