import { createFileRoute } from "@tanstack/react-router";
import { configure } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  createRootStore,
  type CommentStore,
  type DocumentStore,
  type RootStore,
} from "~/stores";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

let documentCounter = 0;
let commentCounter = 0;

configure({
  disableErrorBoundaries: true,
});

function Home() {
  const rootStore = useMemo(() => createRootStore(), []);

  return (
    <div className="p-10">
      <div className="flex gap-5 items-center">
        <h3>Documents</h3>
        <button
          className="px-4 py-2 text-blue-500 cursor-pointer"
          onClick={() => {
            rootStore.documents.insert({
              id: `d${documentCounter++}`,
              title: `Document ${documentCounter}`,
            });
          }}
        >
          [+ Add Document]
        </button>

        <button
          className="px-4 py-2 text-red-500 cursor-pointer"
          onClick={() => {
            rootStore.documents.clear();
          }}
        >
          [+ Clear Documents]
        </button>
      </div>

      <Documents rootStore={rootStore} />
    </div>
  );
}

const Documents = observer(({ rootStore }: { rootStore: RootStore }) => {
  return (
    <div>
      {Object.values(rootStore.documents.records).map((document) => (
        <Document
          key={document.id}
          rootStore={rootStore}
          documentId={document.id}
        />
      ))}
    </div>
  );
});

const Document = observer(
  ({ rootStore, documentId }: { rootStore: RootStore; documentId: string }) => {
    const document = rootStore.documents.records[documentId];

    return (
      <div className="px-10">
        <div className="flex gap-10 items-center">
          <div>{document.title}</div>
          <button
            className="px-4 py-2 text-blue-500 cursor-pointer"
            onClick={() => {
              const id = `c${commentCounter++}`;
              rootStore.comments.insert({
                id,
                document_id: document.id,
                content: `Comment ${id}`,
              });
            }}
          >
            [+ Add Comment]
          </button>
        </div>

        <div className="px-10">
          <Comments document={document} />
        </div>
      </div>
    );
  }
);

const Comments = observer(({ document }: { document: DocumentStore }) => {
  return (
    <div>
      {document.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
});

const Comment = observer(({ comment }: { comment: CommentStore }) => {
  return <div>{comment.content}</div>;
});
