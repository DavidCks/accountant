import { IDBPDatabase, openDB } from "idb";

export class IDB {
  private static NO_ATTACHMENT_KEY_PREFIX = "no-attachment:";
  static db: IDBPDatabase<unknown>;

  static async ensureInitialized() {
    IDB.db = await openDB("AttachmentCache", 1, {
      upgrade(db) {
        db.createObjectStore("attachments");
      },
    });
  }

  static async markNoAttachment(txId: string) {
    await IDB.ensureInitialized();
    const db = IDB.db;
    await db.put(
      "attachments",
      "__NO_ATTACHMENT__",
      IDB.NO_ATTACHMENT_KEY_PREFIX + txId,
    );
  }

  static async hasNoAttachment(txId: string): Promise<boolean> {
    await IDB.ensureInitialized();
    const db = IDB.db;
    const result = await db.get(
      "attachments",
      IDB.NO_ATTACHMENT_KEY_PREFIX + txId,
    );
    return result === "__NO_ATTACHMENT__";
  }

  static async unmarkNoAttachment(txId: string) {
    await IDB.ensureInitialized();
    const db = IDB.db;
    await db.delete("attachments", IDB.NO_ATTACHMENT_KEY_PREFIX + txId);
  }

  static async storeBlob(txId: string, blob: Blob) {
    await IDB.ensureInitialized();
    const db = IDB.db;
    await db.put("attachments", blob, txId);
  }

  static async getBlob(txId: string): Promise<Blob | null> {
    await IDB.ensureInitialized();
    const db = IDB.db;
    return (await db.get("attachments", txId)) ?? null;
  }

  static async deleteBlob(txId: string) {
    await IDB.ensureInitialized();
    const db = IDB.db;
    await db.delete("attachments", txId);
  }
}
