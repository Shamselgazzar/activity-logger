import React from 'react';
import Image from 'next/image';
import { FilterPopover } from "../components/filter-popover.component";
import { Filters } from "../models/Filters";

interface ActionsBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onExportClick: () => void;
  toggleLiveView: () => void;
  isLiveView: boolean;
  handleFilter: (newFilters: React.SetStateAction<Filters>) => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ search, setSearch, onExportClick, toggleLiveView, isLiveView, handleFilter }) => {
  return (
    <div id="actions-bar-container" className="bg-gray-100 px-2 mx-5 mt-5 mb-2 rounded-xl flex flex-wrap items-center border border-gray-200">
      <div className="w-full sm:flex-grow sm:w-auto">
        <input
          type="text"
          title="name, email, action, or group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, action, or group..."
          className="text-sm font-semibold bg-gray-100 text-gray-800 px-2 py-1 border-b-0 border-gray-300 w-full sm:flex-grow focus:outline-none"
        />
      </div>
      <div className="border-l border-gray-300 h-10 mx-2 hidden sm:block"></div>
      <div className="w-full flex sm:w-auto">
        <FilterPopover applyFilters={handleFilter} />
        <div className="border-l border-gray-300 h-10 mx-2 hidden sm:block"></div>
        <button
          onClick={onExportClick}
          className="px-3 py-1 text-gray-800 text-xs rounded flex items-center justify-center hover:scale-105 w-full sm:w-auto"
        >
          <Image src='/export.svg' alt='export icon' width={20} height={20} className="mr-1" />
          EXPORT
        </button>
        <div className="border-l border-gray-300 h-10 mx-2 hidden sm:block"></div>
        <button
          onClick={toggleLiveView}
          className="px-3 py-1 text-xs text-gray-800 rounded flex items-center justify-center hover:scale-105 w-full sm:w-auto"
        >
          <Image src='/live.svg' alt='live icon' width={15} height={15} className="mr-1" />
          {isLiveView ? 'LIVE (ON)' : 'LIVE'}
        </button>
      </div>
    </div>
  );
};

export default ActionsBar;
