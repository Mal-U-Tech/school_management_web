import { createAction, props } from "@ngrx/store";
import { IReports, IReportsPostDTO } from "src/app/shared/reports/reports.interface";

// general actions
export const reportsIsLoading = createAction(
  '[Reports] Reports is loading',
  props<{isLoading: boolean}>()
);

export const resetChosenReport = createAction(
  '[Reports] Reset chosen report'
);

export const setChosenReport = createAction(
  '[Reports] Set chosen report',
  props<{chosenReport: IReports}>()
);

// post report action
export const postReportRequest = createAction(
  '[Reports] Post report request',
  props<{report: IReports}>()
);

export const postReportSuccess = createAction(
  '[Reports] Post report success',
  props<{report: IReports}>()
);

export const postReportError = createAction(
  '[Reports] Post report error',
  props<{message: string}>()
);

// get all reports actions
export const getReportsRequest = createAction(
  '[Reports] Get reports request',
);

export const getReportsSuccess = createAction(
  '[Reports] Get reports success',
  props<{reports: IReports[]}>()
);

export const getReportsError = createAction(
  '[Reports] Get reports error',
  props<{message: string}>()
);

// get one report actions
export const getOneReportRequest = createAction(
  '[Reports] Get one report request',
  props<{id: string}>()
);

export const getOneReportSuccess = createAction(
  '[Reports] Get one report success',
  props<{report: IReports}>()
);

export const getOneReportError = createAction(
  '[Reports] Get one report error',
  props<{message: string}>()
);

// update report actions
export const updateReportRequest = createAction(
  '[Reports] Update report request',
  props<{id: string, report: IReports}>()
);

export const updateReportSuccess = createAction(
  '[Reports] Update report success',
  props<{report: IReports}>()
);

export const updateReportError = createAction(
  '[Reports] Update report error',
  props<{message: string}>()
);

// delete report actions
export const deleteReportRequest = createAction(
  '[Reports] Delete report request',
  props<{id: string}>()
);

export const deleteReportSuccess = createAction(
  '[Reports] Delete report success',
  props<{id: string}>()
);

export const deleteReportError = createAction(
  '[Reports] Delete report error',
  props<{message: string}>()
);
