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
    ResumeControllerBase.userPromise.then((user) => {
      if (user.value) {
        ResumeControllerBase.user = user.value;
        const remote = user.value.user_metadata?.cv_data as string | null;
        // const remote = user.value.user_metadata?.cv_data as string | null;
        const next = {
          ...(cvDataCache ?? {}),
          ...(remote ? JSON.parse(remote) : {}),
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

  public static applyBuffer() {
    ResumeControllerBase.set({
      data: ResumeControllerBase.state.dataBuffer.peek(),
    });
  }
}

export const ResumeController = withControllerHelpers(ResumeControllerBase);
