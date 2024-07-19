'use client';
import Image from "next/image";
import { useState } from "react";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";


export default function Home() {

  const rows = [
    {
      key: "1",
      name: "Tony Reichertt",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
  ];
  
  const columns = [
    {
      key: "actor",
      label: "ACTOR",
    },
    {
      key: "action",
      label: "ACTION",
    },
    {
      key: "date",
      label: "DATE",
    },
  ];
  
  const [events, setEvents] = useState([
    // Example data
    { key: "1", actor: "ali@instatus.com", action: "user.searched_activity_log_events", date: "Aug 7, 5:38 PM" },
    { key: "2", actor: "ali@instatus.com", action: "user.login_succeeded", date: "Aug 7, 4:48 PM" },
    { key: "3", actor: "omar@instatus.com", action: "user.invited_teammate", date: "Aug 7, 2:22 PM" },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) =>
    event.actor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: any) => {
    setSearchTerm(term);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };

  const handleLoadMore = () => {
    // Load more events logic here
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      
      <Table aria-label="events-table"
        selectionMode="single"
        defaultSelectedKeys={selectedEvent.key}
        >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={events} >
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
