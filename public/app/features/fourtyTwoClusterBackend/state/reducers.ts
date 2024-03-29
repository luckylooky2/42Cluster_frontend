import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FourtyTwoClusterBackendDTO, FourtyTwoClusterBackendState } from 'app/types';

export const initialState: FourtyTwoClusterBackendState = {
  serviceId: 0,
  serviceName: '',
  dashboards: [],
  isValid: false,
};

const fourtyTwoClusterBackendSlice = createSlice({
  name: 'fourtyTwoClusterBackend',
  initialState,
  reducers: {
    fourtyTwoClusterBackendFetching: (state, action: PayloadAction<FourtyTwoClusterBackendDTO>) => ({
      ...action.payload,
      isValid: true,
    }),
    fourtyTwoClusterBackendCleanUp: (state) => initialState,
  },
});

export const { fourtyTwoClusterBackendFetching } = fourtyTwoClusterBackendSlice.actions;

export const fourtyTwoClusterBackendReducer = fourtyTwoClusterBackendSlice.reducer;

export default {
  fourtyTwoClusterBackend: fourtyTwoClusterBackendReducer,
};
