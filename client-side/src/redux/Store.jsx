import {configureStore} from '@reduxjs/toolkit';
import expandedReducer from './ExpandedSlicer';

export const Store=configureStore(
  {
    reducer:expandedReducer
  }
)