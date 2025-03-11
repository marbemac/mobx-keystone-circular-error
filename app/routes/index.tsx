import { createFileRoute } from "@tanstack/react-router";
import { configure } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { createRootStore, type DocumentStore, type RootStore } from "~/stores";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

configure({
  disableErrorBoundaries: true,
});

function Home() {
  const rootStore = useMemo(() => createRootStore(), []);

  return (
    <div className="p-10">
      <div className="flex gap-5 items-center">
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
          <div>Document: {document.id}</div>
        </div>

        <Comments document={document} />
      </div>
    );
  }
);

const Comments = observer(({ document }: { document: DocumentStore }) => {
  // just making sure document.comments is observed, to trigger the error
  console.log(document.comments);
  return null;
});
