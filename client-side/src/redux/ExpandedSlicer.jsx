import {createSlice} from '@reduxjs/toolkit';

const initialState={
  expanded:false
}

const ExpandedSlicer=createSlice({
  name:'expanded',
  initialState,
  reducers:{
    setExpanded:(state)=>{
      state.expanded=!state.expanded;
    }
  }
})

export const {setExpanded}=ExpandedSlicer.actions;

export default ExpandedSlicer.reducer;