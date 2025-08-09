import { observable, Observable } from "@legendapp/state";
import { CVData, CVDataType } from "./utils/pdf/templates/CVData";
import { withControllerHelpers } from "@/lib/__state__/controller-helpers";

type ResumeState = {
  data: CVDataType;
  dataBuffer: CVDataType;
};

class ResumeControllerBase {
  private static CV_DATA_CACHE_KEY = "ResumeController-CVData";
  public static state: Observable<ResumeState> = observable<ResumeState>({
    data: new CVData({}).state,
    dataBuffer: new CVData({}).state,
  });

  public static init() {
    const cvDataCacheString = localStorage.getItem(
      ResumeControllerBase.CV_DATA_CACHE_KEY,
    );
    if (!cvDataCacheString) {
      return {};
    }
    const cvDataCache = JSON.parse(cvDataCacheString) as CVDataType;
    ResumeControllerBase.set({
      data: cvDataCache,
      dataBuffer: cvDataCache,
    });
  }

  public static set(state: Partial<ResumeState>) {
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
