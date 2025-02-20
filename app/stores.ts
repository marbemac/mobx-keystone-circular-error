import { computed } from "mobx";
import { getRoot, idProp, Model, model, modelAction, prop, registerRootStore } from "mobx-keystone";

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
export class DocumentsStore
	extends Model({
		records: prop<Record<string, DocumentStore>>(() => ({})),
	})
{
	@modelAction
	insert(record: any) {
		return insertRecord(this.records, DocumentStore, record);
	}

	@modelAction
	remove(id: string) {
		removeRecord(this.records, id);
	}

	@modelAction
	clear() {
		this.records = {};
	}
}

@model("el/DocumentStore")
export class DocumentStore extends Model({
	id: idProp,
	title: prop<string>(),
}) {
	@computed
	get comments() {
		return Object.values(getRoot<RootStore>(this).comments.records).filter(
			(comment) => comment.document_id === this.id,
		);
	}
}

@model("el/CommentsStore")
export class CommentsStore
	extends Model({
		records: prop<Record<string, CommentStore>>(() => ({})),
	})
{
	@modelAction
	insert(record: any) {
		return insertRecord(this.records, CommentStore, record);
	}

	@modelAction
	remove(id: string) {
		removeRecord(this.records, id);
	}

	@modelAction
	clear() {
		this.records = {};
	}
}

@model("el/CommentStore")
export class CommentStore extends Model({
	id: idProp,
	document_id: prop<string>(),
	content: prop<string>(),
}) {
	@computed
	get document() {
		return getRoot<RootStore>(this).documents.records[this.document_id];
	}
}

const insertRecord = <T, P extends { id: string }>(
	records: Record<string, T>,
	model: new (data: P) => T,
	props: P,
): T => {
	let existing = records[props.id];
	if (!existing) {
		existing = new model(props);
		records[props.id] = existing;
	}

	return existing;
};

const removeRecord = <T extends { id: string }>(
	records: Record<string, T>,
	id: string,
) => {
	if (records[id]) {
		delete records[id];
	}
};
