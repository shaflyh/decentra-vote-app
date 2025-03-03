// src/utils/logger.ts

export const logPrefix = "[useVoting]";

/**
 * Logs contract read operations.
 * @param functionName Name of the contract function being read.
 * @param data The returned data from the contract.
 * @param error Any error that occurred during the contract read.
 * @param isLoading Indicates if the contract read is still loading.
 * @param initialRenders A ref object to track first renders.
 */
export const logContractRead = <T>(
  functionName: string,
  data: T | undefined,
  error: Error | null,
  isLoading: boolean,
  initialRenders: React.RefObject<Record<string, boolean>>
) => {
  const isInitialRender = initialRenders.current[functionName];

  if (error) {
    console.error(`${logPrefix} ${functionName} ERROR:`, error);
  } else if (!isLoading) {
    if (isInitialRender) {
      console.log(`${logPrefix} ${functionName} INITIAL:`, data);
      initialRenders.current[functionName] = false; // Mark as no longer initial
    } else {
      console.log(`${logPrefix} ${functionName} UPDATED:`, data);
    }
  }
};

/**
 * Logs contract events when they occur.
 * @param eventName Name of the contract event.
 * @param logs Event log data.
 */
export const logEvent = (eventName: string, logs: unknown) => {
  console.log(`${logPrefix} EVENT ${eventName}:`, logs);
  console.log(`${logPrefix} Refreshing data...`);
};
