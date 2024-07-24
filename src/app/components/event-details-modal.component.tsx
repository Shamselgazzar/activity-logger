import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { DetailedEvent } from "../../models/DetailedEvent";
import { formatDate } from '../../utils/utils';


interface EventDetailsModalProps {
  event: DetailedEvent | null;
  onClose: () => void;
}

export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <Modal
      isOpen={Boolean(event)}
      onOpenChange={onClose}
      className="w-full max-w-4xl p-6 backdrop-blur-md"
    >
      <ModalContent className="bg-white rounded-lg shadow-lg">
        <ModalHeader className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Event Details</h2>
        </ModalHeader>
        <ModalBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="py-2 px-4 bg-gray-100 rounded">
              <h3 className="text-sm font-semibold text-gray-500">ACTOR</h3>
              <div className="flex flex-col">
                <p className="text-xs">Name: <strong>{event.actor.name}</strong></p>
                <p className="text-xs">Email: <strong>{event.actor.email}</strong></p>
                <p className="text-xs">ID: <strong>{event.actor.id}</strong></p>
              </div>
            </div>
            <div className="py-2 px-4 bg-gray-100 rounded">
              <h3 className="text-sm font-semibold text-gray-500">ACTION</h3>
              <div className="flex flex-col">
                <p className="text-xs">Name: <strong>{event.action.name}</strong></p>
                <p className="text-xs">Object: <strong>{event.action.object}</strong></p>
                <p className="text-xs">ID: <strong>{event.action.id}</strong></p>
              </div>
            </div>
            <div className="py-2 px-4 bg-gray-100 rounded">
              <h3 className="text-sm font-semibold text-gray-500">DATE</h3>
              <p className="text-xs">
                Readable: <strong>{formatDate(String(event.occurredAt))}</strong>
              </p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="py-2 px-4 bg-gray-100 rounded col-span-2">
              <h3 className="text-sm font-semibold text-gray-500">METADATA</h3>
              <pre className="whitespace-pre-wrap overflow-auto text-xs p-4 rounded">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            </div>
            <div className="py-2 px-4 bg-gray-100 rounded col-span-1">
              <h3 className="text-sm font-semibold text-gray-500">TARGET</h3>
              {event.target ? (
                <div className="flex flex-col">
                  <p className="text-xs">Name: <strong>{event.target.name}</strong></p>
                  <p className="text-xs">Email: <strong>{event.target.email}</strong></p>
                  <p className="text-xs">ID: <strong>{event.target.id}</strong></p>
                </div>
              ) : (
                <p className="text-xs">No target data for this event.</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-xs font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Close
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventDetailsModal;
