export interface Measurement {
  startTimeOfScan: Date;
  endTimeOfScan: Date | null;
  duration: number;
  receivedData: boolean;
  timedOut: boolean;
}
