'use client';
import React, { useState, useEffect, Key, useCallback } from "react";
import useSWR from 'swr';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Avatar } from "@nextui-org/react";
import { DetailedEvent } from "../models/DetailedEvent";
import { EventsResponse } from "../models/EventsResponse";
import { handleExport } from "../utils/exportUtils"; 
import Image from 'next/image';
import EventDetailsModal from "../components/event-details-modal.component";
import { formatDate } from '../utils/utils';
import '../app/globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { FilterPopover } from "../components/filter-popover.component";
import { Filters } from "../models/Filters";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [search, setSearch] = useState('');
  const [searchedData, setSearchedData] = useState({ events: [], totalCount: 0, numberOfPages: 1, page: 1, pageSize: 4 } as EventsResponse);
  const [selectedEvent, setSelectedEvent] = useState<DetailedEvent | null>(null); // Track selected event
  const [isLiveView, setIsLiveView] = useState(false);
  const refreshInterval = isLiveView ? 5000 : 0;
  const [filters, setFilters] = useState({} as Filters);

  const { data, error, isLoading }: { data: EventsResponse, error: any, isLoading: boolean } = useSWR(
    `/api/events?page=${page}&pageSize=${pageSize}`,
    fetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on window focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
      refreshInterval: refreshInterval, // Disable periodic refreshing
    }
  );
  
  const loadingState = isLoading ? "loading" : "idle";

  // Searching Logic
  const searchEvents = useCallback(() => {
    if (!data) return;
    if (!search && !Object.keys(filters).length) {
      setSearchedData(data);
      return;
    }
    const searchedEvents = data.events.filter((item: DetailedEvent) => {
      return (
        (item.actor.name.toLowerCase().includes(search.toLowerCase()) || 
         item.actor.email.toLowerCase().includes(search.toLowerCase()) ||
         item.actor.group.toLowerCase().includes(search.toLowerCase()) ||
         item.action.name.toLowerCase().includes(search.toLowerCase())) &&
        (!filters.actorId || item.actor.id === filters.actorId) &&
        (!filters.targetId || item.target.id === filters.targetId) &&
        (!filters.actionId || item.action.id === filters.actionId) &&
        (!filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.actorName || item.actor.name.toLowerCase().includes(filters.actorName.toLowerCase())) &&
        (!filters.actorGroup || item.actor.group.toLowerCase().includes(filters.actorGroup.toLowerCase())) &&
        (!filters.actorEmail || item.actor.email.toLowerCase().includes(filters.actorEmail.toLowerCase())) &&
        (!filters.actionName || item.action.name.toLowerCase().includes(filters.actionName.toLowerCase()))
      );
    });
    const searchedData = { events: searchedEvents, totalCount: searchedEvents.length, numberOfPages: Math.ceil(searchedEvents.length / pageSize), page: page, pageSize: pageSize } as EventsResponse;
    setSearchedData(searchedData);
  }, [data, search, filters, pageSize]);

  useEffect(() => {
    searchEvents();
  }, [search, searchEvents]);
  
  const getKeyValue = (item: any, columnKey: Key) => {
    const key = String(columnKey);
    switch (key) {
      case 'actor':
        return item.actor ? (
          <div className="flex items-center">
            <div className="flex items-center">
              <Avatar
                className="mr-2 text-white text-large"
                name={item.actor.name.slice(0, 1)}
                classNames={{
                  base: "bg-gradient-to-br from-[#F3994A] to-[#B325E2]",
                  icon: "text-black/80",
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.actor.name}</span>
              <span className="text-sm text-gray-600">({item.actor.email})</span>
            </div>
          </div>
        ) : 'N/A';
      case 'action':
        return item.action.name;
      case 'date':
        return formatDate(item.occurredAt);
      default:
        return '';
    }
  };

  const handleFilter = (newFilters: React.SetStateAction<Filters>) => {
    setFilters(newFilters);
  };

  // Live View Logic
  const toggleLiveView = () => {
    setIsLiveView(!isLiveView);
  };

  useEffect(() => {
    console.log("Live view: ", isLiveView? "ON": "OFF");
    console.log("Interval: ", refreshInterval);
  } , [refreshInterval]);

  const handleRowClick = (event: DetailedEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  
  function onExportClick(): void {
    handleExport(searchedData);
  }

  // UI View
  return (
    <div className="p-6 rounded-lg border-gray-300">
      
      <h1 className="text-2xl font-bold my-4 text-gray-600 mx-auto text-center">
        Activity Logger
      </h1>

      <div id="main-container" className="max-w-5xl mx-auto border rounded-xl border-gray-300 bg-gray-100">

      <div className="bg-gray-100 px-2 mx-5 mt-5 mb-2 rounded-xl flex flex-wrap items-center border border-gray-200">
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
              className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded flex items-center justify-center hover:scale-105 w-full sm:w-auto"
            >
              <Image src='/export.svg' alt='export icon' width={20} height={20} className="mr-1" />
              EXPORT
            </button>
            <div className="border-l border-gray-300 h-10 mx-2 hidden sm:block"></div>
            <button
              onClick={toggleLiveView}
              className="px-3 py-1 bg-gray-100 text-xs text-gray-800 rounded flex items-center justify-center hover:scale-105 w-full sm:w-auto"
            >
              <Image src='/live.svg' alt='live icon' width={15} height={15} className="mr-1" />
              {isLiveView ? 'LIVE (ON)' : 'LIVE'}
            </button>
          </div>
        </div>


        <div id="table-container">
          <Table aria-label="events-table" selectionMode="single" 
          shadow="none"
          isHeaderSticky
          classNames={{
            th: "px-7 pb-2 text-sm font-semibold text-gray-600",
            tr: "no-shadow",
            td: "px-7",
            wrapper: "px-0 pt-0 pb-4",
          }}
          >
            <TableHeader>
              <TableColumn key="actor">ACTOR</TableColumn>
              <TableColumn key="action">ACTION</TableColumn>
              <TableColumn key="date">DATE</TableColumn>
            </TableHeader>
            <TableBody
              items={searchedData.events}
              loadingContent={<Spinner color="current" />}
              loadingState={loadingState}
              emptyContent="No events found"
            >
              {(item: DetailedEvent) => (
                <TableRow
                  key={String(item.id)}
                  onClick={() => handleRowClick(item)}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  {(columnKey) => <TableCell className="font-medium">{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div id="load-more-container" className="bg-gray-100 px-2 p-2 flex justify-between items-center text-center rounded-b-xl relative -mt-4">
          {!isLoading ? (
            <button
              className="w-full bg-gray-100 text-gray-600 font-medium text-sm"
              onClick={() => setPage(page + 1)}
              disabled={searchedData.numberOfPages <= page || page === 0}
              style={searchedData.numberOfPages <= page ? { pointerEvents: 'none', opacity: 0.4 } : {}}
            >
              LOAD MORE
            </button>
          ) : (
            <div className="text-gray-600 mx-auto">Loading...</div>
          )}
        </div>

      </div>

      <EventDetailsModal
        event={selectedEvent}
        onClose={closeModal}
      />
    
      <SpeedInsights />
      <Analytics/>
    </div>
  );
}
