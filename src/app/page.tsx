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
import ActionsBar from "../components/actions-bar.component";
import EventsTable from "../components/events-table.component";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [search, setSearch] = useState('');
  const [searchedData, setSearchedData] = useState({ events: [], totalCount: 0, numberOfPages: 1, page: 1, pageSize: 4 } as EventsResponse);
  const [selectedEvent, setSelectedEvent] = useState<DetailedEvent | null>(null);
  const [isLiveView, setIsLiveView] = useState(false);
  const refreshInterval = isLiveView ? 5000 : 0;
  const [filters, setFilters] = useState({} as Filters);

  const { data, error, isLoading }: { data: EventsResponse, error: any, isLoading: boolean } = useSWR(
    `/api/events?page=${page}&pageSize=${pageSize}&isLoadMore=true`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
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
  
  const handleFilter = (newFilters: React.SetStateAction<Filters>) => {
    setFilters(newFilters);
  };

  const toggleLiveView = () => {
    setIsLiveView(!isLiveView);
  };

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
    <div id="main-container" className="p-6 rounded-lg border-gray-300">
      
      <h1 id="title" className="text-2xl font-bold my-4 text-gray-600 mx-auto text-center">
        Activity Logger
      </h1>

      <div id="content" className="max-w-5xl mx-auto border rounded-xl border-gray-300 bg-gray-100">

        <ActionsBar 
          search={search}
          setSearch={setSearch}
          onExportClick={onExportClick}
          toggleLiveView={toggleLiveView}
          isLiveView={isLiveView}
          handleFilter={handleFilter}
        />
        
        <EventsTable 
          searchedData={searchedData}
          loadingState={loadingState}
          handleRowClick={handleRowClick}
        />

        <div id="load-more-button" className="bg-gray-100 px-2 p-2 flex justify-between items-center text-center rounded-b-xl relative -mt-4">
          {!isLoading ? (
            <button
              className="w-full bg-gray-100 text-gray-500 text-sm font-semibold rounded hover:text-gray-700"
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
