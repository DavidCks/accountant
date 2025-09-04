import { observable, Observable } from "@legendapp/state";
import { CVData, CVDataType } from "./utils/pdf/templates/CVData";
import { withControllerHelpers } from "@/lib/__state__/controller-helpers";
import { SB } from "../_accountant-supabase_/client";
import { FReturn } from "@/lib/__types__/FReturn";
import { User } from "@supabase/supabase-js";

type ResumeState = {
  data: CVDataType;
  dataBuffer: CVDataType;
};

class ResumeControllerBase {
  private static CV_DATA_CACHE_KEY = "ResumeController-CVData";
  private static userPromise: Promise<FReturn<User>>;
  private static user: User | null;
  public static isLoading: Observable<boolean> = observable<boolean>(false);
  private static isLoadingInternal: boolean = false;
  public static state: Observable<ResumeState> = observable<ResumeState>({
    data: new CVData({}).state,
    dataBuffer: new CVData({}).state,
  });

  private static setIsLoading(tf: boolean) {
    ResumeControllerBase.isLoadingInternal = tf;
    ResumeControllerBase.isLoading.set(tf);
  }

  public static init() {
    // ResumeControllerBase.setIsLoading(true);
    const cvDataCacheString = localStorage.getItem(
      ResumeControllerBase.CV_DATA_CACHE_KEY,
    );
    const cvDataCache = cvDataCacheString
      ? (JSON.parse(cvDataCacheString) as CVDataType)
      : null;

    if (cvDataCache) {
      ResumeControllerBase.set({
        data: cvDataCache,
        dataBuffer: cvDataCache,
      });
    }
    ResumeControllerBase.userPromise = SB.getCurrentUser();
    ResumeControllerBase.userPromise.then(async (user) => {
      if (user.value) {
        ResumeControllerBase.user = user.value;
        // fetch metadata row for this user
        const { data: metaRow, error: metaErr } = await SB.client
          .from("metadata")
          .select("data")
          .eq("user_uid", user.value.id)
          .maybeSingle();

        if (metaErr) {
          console.warn("[metadata] fetch error:", metaErr.message);
        }

        // read cv_data from metadata.data.cv_data (can be object or stringified JSON)
        let remote: any = null;
        const raw = metaRow?.data?.cv_data;
        if (raw != null) {
          try {
            remote = typeof raw === "string" ? JSON.parse(raw) : raw;
          } catch (e) {
            console.warn("[metadata] failed to parse cv_data:", e);
          }
        }

        const next = {
          ...(cvDataCache ?? {}),
          ...(remote ?? {}),
          imageUri: cvDataCache?.imageUri ?? "",
        } as CVDataType;

        if (next) {
          ResumeControllerBase.set({
            data: next,
            dataBuffer: next,
          });
          localStorage.setItem(
            ResumeControllerBase.CV_DATA_CACHE_KEY,
            JSON.stringify(next),
          );
        }
      } else if (cvDataCache) {
        ResumeControllerBase.set({
          data: cvDataCache,
          dataBuffer: cvDataCache,
        });
      } else {
        ResumeControllerBase.setIsLoading(false);
      }
      return user;
    });
  }

  public static set(state: Partial<ResumeState>) {
    if (!ResumeControllerBase.isLoadingInternal) {
      ResumeControllerBase.setIsLoading(true);
    }
    const old = ResumeControllerBase.state.peek();

    // start with old values
    let nextData = old.data;
    let nextBuffer = old.dataBuffer;

    // Handle data (persist + normalize)
    if (state.data) {
      const merged = { ...old.data, ...state.data };
      const json = JSON.stringify(merged);
      localStorage.setItem(ResumeControllerBase.CV_DATA_CACHE_KEY, json);
      nextData = new CVData(JSON.parse(json)).state;
    }

    // Handle dataBuffer (no persistence)
    if (state.dataBuffer) {
      const mergedBuffer = { ...old.dataBuffer, ...state.dataBuffer };
      nextBuffer = new CVData(mergedBuffer).state;
    }

    if (ResumeControllerBase.user) {
      const newStateString = JSON.stringify({ ...nextData, imageUri: "" });
      SB.updateUserMetadata("cv_data", newStateString).then(() => {
        ResumeControllerBase.setIsLoading(false);
      });
    } else {
      ResumeControllerBase.setIsLoading(false);
    }
    ResumeControllerBase.state.set({
      ...old,
      data: nextData,
      dataBuffer: nextBuffer,
    });
  }

  public static getDenseResume(): string {
    const data = ResumeControllerBase.state.data.peek();
    return (
      `workTitle: ${data.workTitle}\n` +
      `tagLine: ${data.tagLine}\n` +
      `subTagline: ${data.subTagLine}\n` +
      `story: ${data.story}` +
      `workExperience: ` +
      data.workExperience
        .map((w) => {
          return w.details
            .map((d) => {
              return d.description;
            })
            .join("\n");
        })
        .join("\n") +
      `projects: \n` +
      data.projects
        .map((w) => {
          return `${w.title}\n` + `details: ${w.details}\n` + `${w.technology}`;
        })
        .join("\n") +
      `skills: \n` +
      Object.entries(data.skills)
        .map((o) => {
          return `${o[0]}: ${o[1].description}; ${o[1].technology}`;
        })
        .join("\n")
    );
  }

  public static applyBuffer() {
    ResumeControllerBase.set({
      data: ResumeControllerBase.state.dataBuffer.peek(),
    });
  }

  public static export() {
    const data = ResumeControllerBase.state.dataBuffer.peek();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv_data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  public static import(file: File) {
    const importPromise = new Promise<void>((resolve, reject) => {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("Please select a .json file");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result || "");
          const parsed = JSON.parse(text);
          // Very light validation to avoid obvious mistakes
          if (typeof parsed !== "object" || parsed === null) {
            throw new Error("Invalid structure");
          }
          ResumeControllerBase.set({ data: parsed, dataBuffer: parsed });
          resolve();
        } catch (err) {
          console.error(err);
          reject("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    });
    return importPromise;
  }
}

export const ResumeController = withControllerHelpers(ResumeControllerBase);
