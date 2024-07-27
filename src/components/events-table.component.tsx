import React, { Key } from "react";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Avatar } from "@nextui-org/react";
import { DetailedEvent } from "../models/DetailedEvent";
import { EventsResponse } from "../models/EventsResponse";
import { formatDate } from '../utils/utils';

interface EventsTableProps {
  searchedData: EventsResponse;
  loadingState: "loading" | "idle";
  handleRowClick: (event: DetailedEvent) => void;
}

export function EventsTable({ searchedData, loadingState, handleRowClick }: EventsTableProps) {
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

  return (
    <div id="table-container">
			<Table aria-label="events-table" selectionMode="single" 
			shadow="none"
			isHeaderSticky
			classNames={{
				th: "px-7 pb-2 text-sm font-semibold text-gray-600",
				tr: "no-shadow",
				td: "px-7",
				wrapper: "px-0 pt-0 pb-4"
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
  );
};

// export default EventsTable;
