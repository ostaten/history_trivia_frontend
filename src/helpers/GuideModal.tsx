import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';

type GuideModalProps = {
  show: boolean;
  onClose: () => void;
};

function GuideModal({ show, onClose }: GuideModalProps) {
  return (
    <Modal show={show} onClose={onClose} size="lg">
      <ModalHeader>How to Play</ModalHeader>
      <ModalBody>
        <div className="space-y-4 text-text-primary">
          <section>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Objective
            </h3>
            <p className="text-text-primary">
              Your goal is to place historical events (or story events for
              custom kwizzes) in chronological order from earliest to latest.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              How to Play
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-text-primary">
              <li>
                <strong>Drag and Drop:</strong> Drag events from the "Unplaced
                Events" area to the timeline. You can also click and drag the
                "On Deck" event (the one at the top) directly onto the timeline.
              </li>
              <li>
                <strong>Place Events:</strong> Drop events onto the timeline
                where you think they belong chronologically. Events should be
                ordered from earliest (top) to latest (bottom).
              </li>
              <li>
                <strong>Confirm Placement:</strong> After placing an event, a
                "Tap to Confirm Placement" button will appear. Click it to lock
                the event in place and check if it's correct.
              </li>
              <li>
                <strong>Scoring:</strong> You earn points for correct
                placements. The score is displayed in the upper right corner.
                Correct answers flash green, incorrect answers flash red.
              </li>
              <li>
                <strong>Complete the Kwiz:</strong> Continue placing and
                confirming events until all events are in chronological order.
                Your final score will be saved for daily and dated kwizzes.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-primary">Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-text-primary">
              <li>
                Read each event description carefully - they contain clues about
                when they occurred.
              </li>
              <li>
                You can rearrange events on the timeline before confirming them.
              </li>
              <li>
                The first event is already placed to help you get started.
              </li>
              <li>
                For custom kwizzes, you can try the same topic multiple times to
                get different events!
              </li>
            </ul>
          </section>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-primary text-off-dark font-semibold rounded-lg hover:bg-primary-bright transition-all duration-200 cursor-pointer"
        >
          Got it!
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default GuideModal;
