import { createReducer, on } from "@ngrx/store";
import { IReports } from "src/app/shared/reports/reports.interface";
import { deleteReportError, deleteReportRequest, deleteReportSuccess, getOneReportRequest, getOneReportSuccess, getReportsError, getReportsRequest, getReportsSuccess, postReportError, postReportRequest, postReportSuccess, reportsIsLoading, resetChosenReport, setChosenReport, updateReportError, updateReportRequest, updateReportSuccess } from "./reports.actions";

export interface ReportState {
  reports: IReports[];
  chosenReport: IReports;
  errorMessage: string;
  reportsIsLoading: boolean;
}

export const initialState: ReportState = {
  reports: null as any,
  chosenReport: null as any,
  errorMessage: '',
  reportsIsLoading: false
}

export const reportReducer = createReducer(
  initialState,
  on(
    reportsIsLoading,
    (state, {isLoading}): ReportState => ({
      ...state,
      reportsIsLoading: isLoading
    })
  ),
  on(
    resetChosenReport,
    (state): ReportState => ({
      ...state,
      chosenReport: null as any
    })
  ),
  on(
    setChosenReport,
    (state, {chosenReport}): ReportState => ({
      ...state,
      chosenReport: chosenReport,
    })
  ),

  // post actions reducer
  on(
    postReportRequest,
    (state, {report}): ReportState => ({...state})
  ),
  on(
    postReportSuccess,
    (state, {report}): ReportState => ({
      ...state,
      reports: [...state.reports, report],
      errorMessage: ''
    })
  ),
  on(
    postReportError,
    (state, {message}): ReportState => ({
      ...state,
      errorMessage: message
    })
  ),

  // get all actions reducer
  on(
    getReportsRequest,
    (state): ReportState => ({...state})
  ),
  on(
    getReportsSuccess,
    (state, {reports}): ReportState => ({
      ...state,
      reports: reports,
      errorMessage: ''
    })
  ),
  on(
    getReportsError,
    (state, {message}): ReportState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // update report actions reducer
  on(
    updateReportRequest,
    (state, {id, report}): ReportState => ({...state})
  ),
  on(
    updateReportSuccess,
    (state, {report}): ReportState => {

      const index = state.reports.findIndex(
        (repo) => repo._id || '' === report._id || ''
      );
      const newArr = [...state.reports];
      newArr[index] = report;

      return {
        ...state,
        reports: newArr,
        errorMessage: ''
      }
    }
  ),
  on(
    updateReportError,
    (state, {message}): ReportState => ({
      ...state,
      errorMessage: message
    })
  ),


  // delete report actions reducer
  on(
    deleteReportRequest,
    (state, {id}): ReportState => ({...state})
  ),
  on(
    deleteReportSuccess,
    (state, {id}): ReportState => {

      const newArr = state.reports.filter((repo) => repo._id || '' !== id);

      return {
        ...state,
        reports: newArr,
        errorMessage: ''
      }
    }
  ),
  on(
    deleteReportError,
    (state, {message}): ReportState => ({
      ...state,
      errorMessage: message
    })
  ),
);
