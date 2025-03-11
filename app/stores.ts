import { computed } from "mobx";
import {
  getRoot,
  idProp,
  Model,
  model,
  modelAction,
  prop,
  registerRootStore,
} from "mobx-keystone";

export function createRootStore(): RootStore {
  const rootStore = new RootStore({});

  registerRootStore(rootStore);

  if (typeof window !== "undefined") {
    // @ts-expect-error ignore
    window.__ROOT_STORE__ = rootStore;
  }

  return rootStore;
}

@model("el/RootStore")
export class RootStore extends Model({
  documents: prop<DocumentsStore>(() => new DocumentsStore({})),
  comments: prop<CommentsStore>(() => new CommentsStore({})),
}) {}

@model("el/DocumentsStore")
export class DocumentsStore extends Model({
  records: prop<Record<string, DocumentStore>>(() => ({
    doc1: new DocumentStore({
      id: "doc1",
    }),
  })),
}) {
  @modelAction
  clear() {
    this.records = {};
  }
}

@model("el/DocumentStore")
export class DocumentStore extends Model({ id: idProp }) {
  @computed
  get comments() {
    return Object.values(getRoot<RootStore>(this).comments.records).filter(
      (comment) => comment.document_id === this.id
    );
  }
}

@model("el/CommentsStore")
export class CommentsStore extends Model({
  records: prop<Record<string, any>>(() => ({})),
}) {}
