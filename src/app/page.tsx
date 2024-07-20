'use client';
import React, { useState, useEffect, Key } from "react";
import useSWR from 'swr';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { DetailedEvent } from "../models/DetailedEvent";
import { EventsResponse } from "../models/EventsResponse";
import { Spinner } from "@nextui-org/spinner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(2);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState({ events: [], totalCount: 0, numberOfPages: 1, page: 1, pageSize: 5 } as EventsResponse);

  const { data, error, isLoading }: { data: EventsResponse, error: any, isLoading: boolean } = useSWR(
    `/api/events?page=${page}&pageSize=${pageSize}`,
    fetcher,
  );
  const loadingState = isLoading || data?.events.length === 0 ? "loading" : "idle";


  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);
  
  useEffect(() => {
    searchEvents();
  }, [search]);

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
    const filteredData = { events: filteredEvents, totalCount: filteredEvents.length, numberOfPages: Math.ceil(filteredEvents.length/pageSize), page: page, pageSize: pageSize } as EventsResponse;
    setFilteredData(filteredData);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getKeyValue = (item: any, columnKey: Key) => {
    const key = String(columnKey);
    switch (key) {
      case 'actor':
        return item.actor ? `${item.actor.name} (${item.actor.email})` : 'N/A';
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

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const toggleLiveView = () => {
    console.log('Toggling live view...');
  };

  // UI View
  if (error) return <div>Failed to load</div>;

  return (
    <div className=" p-6   rounded-lg border-gray-300"> 
      <h1 className="text-2xl font-bold my-4 text-gray-800 mx-auto text-center">
        Activity Logger
      </h1> 
      <div id="main-container" className="max-w-5xl mx-auto  border rounded-xl border-gray-300  bg-gray-100">
        <div id="search-container" className="bg-gray-100 px-2 mx-2 mt-4 rounded-xl flex items-center border border-gray-200">
          <input
            type="text"
            title="name, email, action, or group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, action, or group..."
            className="text-sm font-semibold bg-gray-100 text-gray-800 px-2 py-1 border-b-0 border-gray-300 flex-grow"
          />
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            onClick={handleFilter} // Replace with your filter function
            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded"
          >
            FILTER
          </button>
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            onClick={handleExport} // Replace with your export function
            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded"
          >
            EXPORT
          </button>
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            onClick={toggleLiveView} // Replace with your live view function
            className="px-3 py-1 bg-gray-100 text-xs text-gray-800 rounded"
          >
            LIVE
          </button>
        </div>


        <div id="table-container" className="no-padding">
          <Table aria-label="events-table" selectionMode="single" shadow="none" className="bg-gray-100"
          classNames={{
            table: "p-0 m-0 bg-transparent",
            
          }}>
            <TableHeader className="rounded-none">
              <TableColumn key="actor">ACTOR</TableColumn>
              <TableColumn key="action">ACTION</TableColumn>
              <TableColumn key="date">DATE</TableColumn>
            </TableHeader>

            <TableBody 
              items={filteredData.events}
              loadingContent={<Spinner color="secondary" size="sm" />}
              loadingState={loadingState}
              >
              {(item: DetailedEvent) => (
                <TableRow key={String(item.id)}>
                  {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div id="load-more-container" className=" bg-gray-100 px-2 p-2 flex justify-between items-center text-center rounded-b-xl relative -mt-4">
          { data? <button
          className="mx-auto bg-gray-100 text-gray-600 bold"
            onClick={() => setPage(page + 1)}
            disabled={filteredData.numberOfPages === page}
            style={filteredData.numberOfPages === page ? { pointerEvents: 'none', opacity: 0.4 } : {}}
          >
            LOAD MORE 
          </button> : <div className="text-gray-600 mx-auto">Loading...</div>
          }
        </div>

        {/* // if (!data) return <div>Loading...</div>; */}

      </div>
    </div>
    
  );

  
}
