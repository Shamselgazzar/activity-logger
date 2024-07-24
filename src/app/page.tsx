'use client';
import React, { useState, useEffect, Key } from "react";
import useSWR from 'swr';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Avatar } from "@nextui-org/react";
import { DetailedEvent } from "../models/DetailedEvent";
import { EventsResponse } from "../models/EventsResponse";
import { handleExport } from "../utils/exportUtils"; 
import Image from 'next/image';
import EventDetailsModal from "./components/event-details-modal.component";
import { formatDate } from '../utils/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState({ events: [], totalCount: 0, numberOfPages: 1, page: 1, pageSize: 5 } as EventsResponse);
  const [selectedEvent, setSelectedEvent] = useState<DetailedEvent | null>(null); // Track selected event

  const { data, error, isLoading }: { data: EventsResponse, error: any, isLoading: boolean } = useSWR(
    `/api/events?page=${page}&pageSize=${pageSize}`,
    fetcher,
  );
  const loadingState = isLoading ? "loading" : "idle";

  useEffect(() => {
    if (data) {
      setSearch('');
      setFilteredData(data);
    }
  }, [data]);


  const searchEvents = () => {
    if (!data) return;
    if (!search) {
      setFilteredData(data);
      return;
    }
    const filteredEvents = data.events.filter((item: DetailedEvent) => {
      return (
        item.actor.name.toLowerCase().includes(search.toLowerCase()) ||
        item.actor.email.toLowerCase().includes(search.toLowerCase()) ||
        item.actor.group.toLowerCase().includes(search.toLowerCase()) ||
        item.action.name.toLowerCase().includes(search.toLowerCase())
      );
    });
    const filteredData = { events: filteredEvents, totalCount: filteredEvents.length, numberOfPages: Math.ceil(filteredEvents.length / pageSize), page: page, pageSize: pageSize } as EventsResponse;
    setFilteredData(filteredData);
  };

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

  const handleFilter = () => {
    console.log('Filtering data...');
  };

  

  const toggleLiveView = () => {
    console.log('Toggling live view...');
  };

  const handleRowClick = (event: DetailedEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  // UI View
  if (error) return <div>Failed to load</div>;

  function onExportClick(): void {
    handleExport(filteredData);
  }

  return (
    <div className="p-6 rounded-lg border-gray-300">
      <h1 className="text-2xl font-bold my-4 text-gray-600 mx-auto text-center">
        Activity Logger
      </h1>
      <div id="main-container" className="max-w-5xl mx-auto border rounded-xl border-gray-300 bg-gray-100">
        <div id="search-container" className="bg-gray-100 px-2 mx-5 mt-5 mb-2 rounded-xl flex items-center border border-gray-200">
          <input
            type="text"
            title="name, email, action, or group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, action, or group..."
            className="text-sm font-semibold bg-gray-100 text-gray-800 px-2 py-1 border-b-0 border-gray-300 flex-grow focus:outline-none"
          />
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            onClick={handleFilter}
            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded flex items-center justify-center hover:scale-105"
          >
            <Image src='/filter.svg' alt='filter icon' width={20} height={20} className="mr-1" />
            FILTER
          </button>
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            onClick={onExportClick}
            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded flex items-center justify-center hover:scale-105"
          >
            <Image src='/export.svg' alt='export icon' width={20} height={20} className="mr-1" />
            EXPORT
          </button>
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            onClick={toggleLiveView}
            className="px-3 py-1 bg-gray-100 text-xs text-gray-800 rounded flex items-center justify-center hover:scale-105"
          >
            <Image src='/live.svg' alt='live icon' width={15} height={15} className="mr-1" />
            LIVE
          </button>
        </div>

        <div id="table-container" className="no-padding">
          <Table aria-label="events-table" selectionMode="single" 
          shadow="none" 
          isHeaderSticky
          classNames={{
            th: "px-7 pb-2 text-sm font-semibold text-gray-600",
            td: "px-7",
          }}
          >
            <TableHeader className="rounded-none">
              <TableColumn key="actor">ACTOR</TableColumn>
              <TableColumn key="action">ACTION</TableColumn>
              <TableColumn key="date">DATE</TableColumn>
            </TableHeader>
            <TableBody
              items={filteredData.events}
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
          {data ? (
            <button
              className="w-full bg-gray-100 text-gray-600 font-medium text-sm"
              onClick={() => setPage(page + 1)}
              disabled={filteredData.numberOfPages <= page}
              style={filteredData.numberOfPages <= page ? { pointerEvents: 'none', opacity: 0.4 } : {}}
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

    </div>
  );
}
